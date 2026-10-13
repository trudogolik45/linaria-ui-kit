# Библиотеку собирает чистый Rollup, а не Vite library mode

Vite 8 собирает через Rolldown, поэтому в library mode Rollup руками не трогаешь. Цель проекта — разобраться именно в Rollup, на котором часто собирают UI-библиотеки, поэтому `packages/ui` собирается `rollup` + `@wyw-in-js/rollup`, а Vite используется только для `apps/demo`. Не «упрощать» до Vite library mode: два сборщика здесь намеренно.
