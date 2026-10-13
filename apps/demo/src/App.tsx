import { Button } from '@trudogolik45/ui';
import { CssModulesButton } from './CssModulesButton/CssModulesButton';
import './App.css';

export function App() {
  return (
    <main>
      <h1>@trudogolik45/ui</h1>

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
        <h2>Linaria vs CSS Modules</h2>
        <p>Выглядят одинаково. Откройте DevTools и сравните имена классов.</p>
        <div className="row">
          <Button>Linaria</Button>
          <CssModulesButton>CSS Modules</CssModulesButton>
        </div>
      </section>
    </main>
  );
}
