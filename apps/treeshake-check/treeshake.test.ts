import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { build } from 'vite';

// Consumer импортирует только Button — остальные компоненты не должны попасть в его сборку.
const IMPORTED = 'Button';

const uiDist = path.resolve(import.meta.dirname, 'node_modules/@trudogolik45/ui/dist');
const outDir = path.resolve(import.meta.dirname, 'dist');

let bundle: string;

beforeAll(async () => {
  await build({ root: import.meta.dirname, logLevel: 'warn', build: { outDir, emptyOutDir: true } });
  const assets = path.join(outDir, 'assets');
  bundle = readdirSync(assets)
    .map((file) => readFileSync(path.join(assets, file), 'utf8'))
    .join('\n');
});

/** Классы, которые Linaria сгенерировала для компонента, — его «отпечатки пальцев». */
function classNamesOf(component: string) {
  const css = readFileSync(path.join(uiDist, component, `${component}.css`), 'utf8');
  return [...new Set([...css.matchAll(/\.([a-z][a-z0-9]{6,})/g)].map((match) => match[1]))];
}

function componentsInDist() {
  return readdirSync(uiDist, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

test('the imported component ships with its styles', () => {
  for (const className of classNamesOf(IMPORTED)) {
    expect(bundle).toContain(`.${className}`);
  }
});

test('the theme tokens ship along with the imported component', () => {
  expect(bundle).toContain('--ui-color-accent:');
});

test.each(componentsInDist().filter((name) => name !== IMPORTED))('%s is shaken out', (component) => {
  for (const className of classNamesOf(component)) {
    expect(bundle).not.toContain(className);
  }
});
