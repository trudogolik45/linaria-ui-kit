import { readFileSync } from 'node:fs';
import path from 'node:path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import wywInJS from '@wyw-in-js/rollup';
import esbuild from 'rollup-plugin-esbuild';

const srcDir = path.resolve('src');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const externalDeps = [...Object.keys(pkg.peerDependencies), ...Object.keys(pkg.dependencies)];

const wyw = wywInJS({
  include: ['**/*.tsx'],
  // Стабильное имя: src/Button/Button.tsx → src/Button/Button.css
  cssFilename: ({ id }) => id.replace(/\.tsx$/, '.css'),
});

/** CSS от Linaria живёт в памяти плагина wyw, обычный `.css` — на диске. */
function readCss(absolutePath) {
  const generated = wyw.load(absolutePath);
  return typeof generated === 'string' ? generated : readFileSync(absolutePath, 'utf8');
}

/**
 * Кладёт CSS каждого модуля рядом с его JS и оставляет в JS `import './X.css'`,
 * чтобы сборщик Consumer подтянул стили сам (см. docs/adr/0002).
 */
function cssNextToComponent() {
  const cssByFile = new Map();

  return {
    name: 'css-next-to-component',
    resolveId(source, importer) {
      if (!source.endsWith('.css') || !importer) return null;

      const absolutePath = path.resolve(path.dirname(importer), source);
      cssByFile.set(path.relative(srcDir, absolutePath), readCss(absolutePath));
      return { id: absolutePath, external: true };
    },
    generateBundle() {
      for (const [fileName, source] of cssByFile) {
        this.emitFile({ type: 'asset', fileName, source });
      }
    },
  };
}

export default {
  input: 'src/index.ts',
  makeAbsoluteExternalsRelative: true,
  external: (id) => externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
  plugins: [cssNextToComponent(), nodeResolve(), wyw, esbuild({ jsx: 'automatic' })],
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
  },
};
