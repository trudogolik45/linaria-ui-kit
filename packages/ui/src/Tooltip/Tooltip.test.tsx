import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Button, Tooltip } from '../index';

/** Курсор остаётся там, где его бросил прошлый тест, — уводим, чтобы проверять только клавиатуру. */
async function pointerAway() {
  await page.getByRole('button', { name: 'Save' }).unhover();
}

function SaveWithHint() {
  return (
    <Tooltip content="Saves the draft">
      <Button>Save</Button>
    </Tooltip>
  );
}

test('shows the hint while the pointer is over the trigger', async () => {
  await render(<SaveWithHint />);
  await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();

  await page.getByRole('button', { name: 'Save' }).hover();

  await expect.element(page.getByRole('tooltip')).toHaveTextContent('Saves the draft');
  await expect.element(page.getByRole('button', { name: 'Save' })).toHaveAccessibleDescription('Saves the draft');
});

test('shows the hint when the trigger gets keyboard focus', async () => {
  await render(<SaveWithHint />);
  await pointerAway();

  await userEvent.keyboard('{Tab}');

  await expect.element(page.getByRole('tooltip')).toHaveTextContent('Saves the draft');
});

test('hides the hint on Escape', async () => {
  await render(<SaveWithHint />);
  await pointerAway();
  await userEvent.keyboard('{Tab}');
  await expect.element(page.getByRole('tooltip')).toBeInTheDocument();

  await userEvent.keyboard('{Escape}');

  await expect.element(page.getByRole('tooltip')).not.toBeInTheDocument();
});
