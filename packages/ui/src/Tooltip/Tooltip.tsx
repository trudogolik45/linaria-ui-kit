import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import { styled } from '@linaria/react';
import { cloneElement, useState, type ReactElement, type ReactNode, type Ref } from 'react';
import '../theme/theme.css';

export type TooltipProps = {
  content: ReactNode;
  /** Элемент-триггер: должен принимать ref и обработчики событий (например, Button). */
  children: ReactElement<Record<string, unknown> & { ref?: Ref<HTMLElement> }>;
};

const Bubble = styled.div`
  padding: 4px 8px;
  border-radius: var(--ui-radius);
  background: var(--ui-color-text);
  color: var(--ui-color-surface);
  font-size: 0.875em;
  pointer-events: none;
`;

export function Tooltip({ content, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  // floating-ui следит, чтобы подсказка не вылезла за край экрана и ехала вместе со скроллом.
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  // Свой ref триггера (если Consumer его передал) не теряем — склеиваем с ref для floating-ui.
  const triggerRef = useMergeRefs([refs.setReference, children.props.ref]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ ...children.props, ref: triggerRef }))}
      {isOpen && (
        <Bubble ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          {content}
        </Bubble>
      )}
    </>
  );
}
