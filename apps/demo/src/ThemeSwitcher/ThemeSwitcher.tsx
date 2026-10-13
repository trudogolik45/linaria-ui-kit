import { Tabs } from '@trudogolik45/ui';
import { useState } from 'react';

type Theme = 'system' | 'light' | 'dark';

/** Тема — только атрибут на <html>: никакого ThemeProvider, CSS-переменные делают остальное. */
function applyTheme(theme: Theme) {
  if (theme === 'system') {
    delete document.documentElement.dataset.theme;
    return;
  }
  document.documentElement.dataset.theme = theme;
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');

  const selectTheme = (value: string) => {
    const next = value as Theme;
    setTheme(next);
    applyTheme(next);
  };

  return (
    <Tabs value={theme} onChange={selectTheme}>
      <Tabs.List>
        <Tabs.Tab value="system">Системная</Tabs.Tab>
        <Tabs.Tab value="light">Светлая</Tabs.Tab>
        <Tabs.Tab value="dark">Тёмная</Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
