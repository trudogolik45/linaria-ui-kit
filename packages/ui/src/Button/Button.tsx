import { styled } from '@linaria/react';
import type { ComponentPropsWithRef } from 'react';
import '../theme/theme.css';

export type ButtonVariant = 'primary' | 'ghost';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Перекрашивает только эту кнопку поверх токена темы `--ui-color-accent`. */
  accentColor?: string;
};

// Linaria превращает функцию в CSS-переменную, которую выставляет inline-стилем.
const Root = styled.button<{ accentColor?: string }>`
  --ui-button-accent: ${(props) => props.accentColor ?? 'var(--ui-color-accent)'};

  font: inherit;
  cursor: pointer;
  border: 1px solid var(--ui-button-accent);
  border-radius: var(--ui-radius);

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-size='small'] {
    padding: 4px 8px;
  }

  &[data-size='medium'] {
    padding: 8px 16px;
  }

  &[data-size='large'] {
    padding: 12px 24px;
  }

  &[data-variant='primary'] {
    background: var(--ui-button-accent);
    color: var(--ui-color-on-accent);
  }

  &[data-variant='ghost'] {
    background: transparent;
    color: var(--ui-button-accent);
  }
`;

export function Button({ variant = 'primary', size = 'medium', ...rest }: ButtonProps) {
  return <Root type="button" data-variant={variant} data-size={size} {...rest} />;
}
