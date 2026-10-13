import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

type PackResult = { files: { path: string }[] }[];

let files: string[];

beforeAll(() => {
  execSync('pnpm build', { stdio: 'inherit' });
  const [result] = JSON.parse(execSync('npm pack --dry-run --json', { encoding: 'utf8' })) as PackResult;
  files = result.files.map((file) => file.path);
});

test('ships the entry point with its type declarations', () => {
  expect(files).toEqual(expect.arrayContaining(['dist/index.js', 'dist/index.d.ts']));
});

test('ships each component as its own JS, CSS and type declarations', () => {
  expect(files).toEqual(
    expect.arrayContaining(['dist/Button/Button.js', 'dist/Button/Button.css', 'dist/Button/Button.d.ts']),
  );
});

test('ships the theme tokens that components import', () => {
  expect(files).toContain('dist/theme/theme.css');
  expect(readFileSync('dist/Button/Button.js', 'utf8')).toContain("import '../theme/theme.css'");
});

test('does not ship sources or tests', () => {
  expect(files.filter((file) => file.startsWith('src/') || file.includes('.test.'))).toEqual([]);
});

test('marks every shipped CSS file as a side effect so bundlers keep its import', () => {
  const { sideEffects } = JSON.parse(readFileSync('package.json', 'utf8')) as { sideEffects: unknown };
  const patterns = Array.isArray(sideEffects) ? (sideEffects as string[]) : [];

  const unprotected = files
    .filter((file) => file.endsWith('.css'))
    .filter((file) => !patterns.some((pattern) => path.matchesGlob(file, pattern) || path.matchesGlob(path.basename(file), pattern)));

  expect(unprotected).toEqual([]);
});
