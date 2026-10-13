import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Button } from '../index';

test('calls onClick when the user clicks the button', async () => {
  const onClick = vi.fn();
  await render(<Button onClick={onClick}>Save</Button>);

  await page.getByRole('button', { name: 'Save' }).click();

  expect(onClick).toHaveBeenCalledOnce();
});

test('accentColor paints only its own button', async () => {
  await render(
    <>
      <Button accentColor="rgb(255, 0, 0)">Red</Button>
      <Button>Default</Button>
    </>,
  );

  const red = page.getByRole('button', { name: 'Red' }).element();
  const plain = page.getByRole('button', { name: 'Default' }).element();

  expect(getComputedStyle(red).backgroundColor).toBe('rgb(255, 0, 0)');
  expect(getComputedStyle(plain).backgroundColor).not.toBe('rgb(255, 0, 0)');
});

test('ghost variant has a transparent background and accent-colored text', async () => {
  await render(
    <Button variant="ghost" accentColor="rgb(255, 0, 0)">
      Ghost
    </Button>,
  );

  const style = getComputedStyle(page.getByRole('button', { name: 'Ghost' }).element());

  expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(style.color).toBe('rgb(255, 0, 0)');
});

test('large button is taller than small button', async () => {
  await render(
    <>
      <Button size="small">Small</Button>
      <Button size="large">Large</Button>
    </>,
  );

  const height = (name: string) =>
    page.getByRole('button', { name }).element().getBoundingClientRect().height;

  expect(height('Large')).toBeGreaterThan(height('Small'));
});

test('primary button takes its color from the theme accent token by default', async () => {
  await render(
    <>
      <Button>Themed</Button>
      <div data-testid="accent-probe" style={{ background: 'var(--ui-color-accent)' }} />
    </>,
  );

  const button = page.getByRole('button', { name: 'Themed' }).element();
  const accent = getComputedStyle(page.getByTestId('accent-probe').element()).backgroundColor;

  expect(accent).not.toBe('rgba(0, 0, 0, 0)');
  expect(getComputedStyle(button).backgroundColor).toBe(accent);
});
