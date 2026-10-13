import { styled } from '@linaria/react';
import { createContext, useContext, useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import '../theme/theme.css';

type TabsContextValue = {
  baseId: string;
  selected: string | undefined;
  select: (value: string) => void;
};

// Context — «общая переменная поддерева»: Tab и Panel узнают выбранную вкладку без пропсов.
const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(part: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<Tabs.${part}> должен быть внутри <Tabs>`);
  return context;
}

export type TabsProps = {
  children: ReactNode;
  /** Uncontrolled: с какой вкладки начать, дальше Tabs помнит выбор сам. */
  defaultValue?: string;
  /** Controlled: выбранную вкладку хранит родитель, Tabs только сообщает о клике через onChange. */
  value?: string;
  onChange?: (value: string) => void;
};

export function Tabs({ children, defaultValue, value, onChange }: TabsProps) {
  const baseId = useId();
  const [ownValue, setOwnValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : ownValue;

  const select = (next: string) => {
    if (!isControlled) setOwnValue(next);
    onChange?.(next);
  };

  return <TabsContext.Provider value={{ baseId, selected, select }}>{children}</TabsContext.Provider>;
}

const ListRoot = styled.div`
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--ui-color-border);
`;

const STEP_BY_KEY: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

function List({ children }: { children: ReactNode }) {
  const { select } = useTabsContext('List');

  const moveSelection = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = STEP_BY_KEY[event.key];
    if (!step) return;

    const tabs = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')];
    const current = tabs.indexOf(event.target as HTMLElement);
    const next = tabs[(current + step + tabs.length) % tabs.length];

    event.preventDefault();
    next.focus();
    select(next.dataset.value!);
  };

  return (
    <ListRoot role="tablist" onKeyDown={moveSelection}>
      {children}
    </ListRoot>
  );
}

const TabRoot = styled.button`
  font: inherit;
  cursor: pointer;
  padding: 8px 12px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--ui-color-text);

  &[aria-selected='true'] {
    border-bottom-color: var(--ui-color-accent);
    color: var(--ui-color-accent);
  }
`;

const tabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;
const panelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { baseId, selected, select } = useTabsContext('Tab');
  const isSelected = value === selected;

  return (
    <TabRoot
      type="button"
      role="tab"
      id={tabId(baseId, value)}
      aria-selected={isSelected}
      aria-controls={panelId(baseId, value)}
      // Roving tabindex: Tab-клавишей попадаешь только на выбранную вкладку, дальше — стрелками.
      // Пока ничего не выбрано, доступны все — иначе на Tabs не попасть с клавиатуры.
      tabIndex={isSelected || selected === undefined ? 0 : -1}
      data-value={value}
      onClick={() => select(value)}
    >
      {children}
    </TabRoot>
  );
}

const PanelRoot = styled.div`
  padding: 12px 0;
`;

function Panel({ value, children }: { value: string; children: ReactNode }) {
  const { baseId, selected } = useTabsContext('Panel');

  return (
    <PanelRoot role="tabpanel" id={panelId(baseId, value)} aria-labelledby={tabId(baseId, value)} hidden={value !== selected}>
      {children}
    </PanelRoot>
  );
}

Tabs.List = List;
Tabs.Tab = Tab;
Tabs.Panel = Panel;
