import { Button, Tabs, Tooltip } from '@trudogolik45/ui';
import { CssModulesButton } from './CssModulesButton/CssModulesButton';
import { ThemeSwitcher } from './ThemeSwitcher/ThemeSwitcher';
import './App.css';

export function App() {
  return (
    <main>
      <header>
        <h1>@trudogolik45/ui</h1>
        <ThemeSwitcher />
      </header>

      <section>
        <h2>Button</h2>
        <div className="row">
          <Button>Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button accentColor="rgb(22, 163, 74)">accentColor</Button>
          <Button variant="ghost" accentColor="rgb(22, 163, 74)">
            Ghost + accentColor
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="row">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      <section>
        <h2>Tabs (uncontrolled)</h2>
        <Tabs defaultValue="linaria">
          <Tabs.List>
            <Tabs.Tab value="linaria">Linaria</Tabs.Tab>
            <Tabs.Tab value="modules">CSS Modules</Tabs.Tab>
            <Tabs.Tab value="runtime">styled-components</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="linaria">Синтаксис CSS-in-JS, на выходе статический CSS при сборке.</Tabs.Panel>
          <Tabs.Panel value="modules">Обычный CSS, сборщик делает имена классов уникальными.</Tabs.Panel>
          <Tabs.Panel value="runtime">CSS генерируется в браузере во время работы.</Tabs.Panel>
        </Tabs>
        <p className="hint">Переключатель темы вверху — те же Tabs в controlled-режиме.</p>
      </section>

      <section>
        <h2>Tooltip</h2>
        <div className="row">
          <Tooltip content="Подсказка появляется при наведении и фокусе, Escape — скрыть">
            <Button variant="ghost">Наведи или Tab</Button>
          </Tooltip>
        </div>
      </section>

      <section>
        <h2>Свои токены</h2>
        <p className="hint">
          Блок ниже переопределяет <code>--ui-color-accent</code> — компоненты внутри перекрашиваются без единого пропа.
        </p>
        <div className="row brand">
          <Button>Primary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section>
        <h2>Linaria vs CSS Modules</h2>
        <p className="hint">Выглядят одинаково. Откройте DevTools и сравните имена классов.</p>
        <div className="row">
          <Button>Linaria</Button>
          <CssModulesButton>CSS Modules</CssModulesButton>
        </div>
      </section>
    </main>
  );
}
