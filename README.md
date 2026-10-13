# linaria-ui-kit

Мини UI-кит из трёх компонентов (`Button`, `Tabs`, `Tooltip`) на **Linaria**, собранный **Rollup** как библиотека, с демо на **Vite**.

**Демо:** https://trudogolik45.github.io/linaria-ui-kit/

## Структура

```
packages/ui            библиотека @trudogolik45/ui — Rollup + @wyw-in-js/rollup
apps/demo              демо на Vite: ставит ui из dist, как настоящий Consumer
apps/treeshake-check   мини-приложение с одной Button — проверяет tree-shaking
docs/adr               почему сделано именно так
CONTEXT.md             словарь терминов
```

## Команды

```sh
pnpm install
pnpm demo              # собрать ui и открыть демо
pnpm test              # компоненты в настоящем Chromium + контракт пакета
pnpm check:treeshake   # в сборку с одной Button не попадают Tabs и Tooltip
pnpm typecheck
```

## Использование

```tsx
import { Button, Tabs, Tooltip } from '@trudogolik45/ui';

<Tooltip content="Сохранить черновик">
  <Button variant="ghost" size="small" accentColor="rebeccapurple">Save</Button>
</Tooltip>

<Tabs defaultValue="a">            {/* uncontrolled */}
  <Tabs.List>
    <Tabs.Tab value="a">A</Tabs.Tab>
    <Tabs.Tab value="b">B</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="a">…</Tabs.Panel>
  <Tabs.Panel value="b">…</Tabs.Panel>
</Tabs>

<Tabs value={tab} onChange={setTab}>…</Tabs>   {/* controlled */}
```

CSS подключать не нужно: каждый компонент сам импортирует свой `.css`.

### Темы и токены

Тема по умолчанию — системная. Зафиксировать вручную: `<html data-theme="dark">` (или `light`).

Токены — публичный контракт, любой можно переопределить в своём CSS:

| Токен | Что красит |
| --- | --- |
| `--ui-color-accent` | основной цвет кнопок и активной вкладки |
| `--ui-color-on-accent` | текст на акцентном фоне |
| `--ui-color-text` | текст |
| `--ui-color-surface` | фон |
| `--ui-color-border` | рамки и разделители |
| `--ui-radius` | скругление углов |

```css
:root { --ui-color-accent: rgb(219, 39, 119); }
```

## Что здесь можно показать на собеседовании

**Rollup vs Vite.** Rollup — сборщик под библиотеки: чистые ES-модули и tree-shaking. До Vite 7 продакшен-сборка Vite шла через Rollup, с Vite 8 — через Rolldown (Rust, API совместим с Rollup). Здесь библиотека собирается чистым Rollup ([ADR 0001](docs/adr/0001-rollup-for-library-vite-for-demo.md)).

**CSS Modules vs styled-components vs Linaria.** CSS Modules — обычный CSS с уникальными именами классов. styled-components/Emotion — CSS-in-JS, стили генерируются в браузере (runtime). Linaria — тот же синтаксис, но CSS извлекается при сборке (zero-runtime). В демо одна и та же кнопка сделана на Linaria и на CSS Modules — сравните классы в DevTools.

**Стиль от пропса в Linaria.** Функция в шаблоне `styled` превращается в CSS-переменную, которую Linaria ставит inline-стилем: так работает `accentColor`. В `css`-теге это не работает — только в `styled`. Поэтому у `styled` остаётся маленький runtime-хелпер.

**CSS на каждый компонент.** Один общий `index.css` не tree-shake'ится: импортировал `Button` — получил стили `Tabs`. Поэтому `preserveModules` и `import './Button.css'` внутри `Button.js` ([ADR 0002](docs/adr/0002-css-per-component-auto-import.md)). Linaria-плагин для этого нужен только библиотеке — Consumer получает обычный CSS.

**`sideEffects`.** `"sideEffects": ["*.css"]` в `package.json` говорит сборщику: JS можно выкидывать, если не используется, а импорты CSS — нельзя. Факт из этого проекта: Vite сохраняет CSS-импорты даже при `"sideEffects": false`, а webpack их выкидывает — поэтому правило проверяет тест контракта пакета, а не сборка через Vite.

**`dependencies` vs `peerDependencies` vs `external`.** `react` — peer: его ставит Consumer, иначе в приложении две копии React и хуки падают. `@floating-ui/react` и `@linaria/react` — обычные зависимости. Все они `external` в Rollup: не вшиваются в `dist`.

**`.d.ts`.** Типы без кода — контракт для редактора Consumer. Генерирует `tsc --emitDeclarationOnly`, JS собирает Rollup + esbuild.

**Темы без JS.** Токены — CSS-переменные со значениями через `light-dark()`; `color-scheme` выбирает светлое или тёмное значение. Никакого `ThemeProvider` и Context.

**Compound component и Context.** `Tabs.Tab` и `Tabs.Panel` узнают выбранную вкладку из React Context, который создаёт `<Tabs>`, — без проброса пропсов.
