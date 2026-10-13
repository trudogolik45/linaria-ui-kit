# CSS на каждый компонент, подключается из JS автоматически

Один общий `index.css` не tree-shake'ится: Consumer, импортировавший только `Button`, получал бы стили `Tabs` и `Tooltip`. Поэтому сборка идёт с `preserveModules`, у каждого компонента свой CSS, и его JS сам делает `import './X.css'`; общий `theme.css` с Design token подключается так же. `"sideEffects": ["*.css"]` в `package.json` обязателен — без него сборщик Consumer выкинет эти импорты; это охраняет `check:treeshake`.

## Consequences

Без сборщика (чистый Node, часть SSR-сценариев) импорт `.css` из JS падает. Принято: React UI-киты почти всегда потребляются через сборщик.
