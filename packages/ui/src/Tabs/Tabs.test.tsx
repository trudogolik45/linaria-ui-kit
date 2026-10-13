import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Tabs } from '../index';

function Fruits(props: { defaultValue?: string; value?: string; onChange?: (value: string) => void }) {
  return (
    <Tabs {...props}>
      <Tabs.List>
        <Tabs.Tab value="apple">Apple</Tabs.Tab>
        <Tabs.Tab value="pear">Pear</Tabs.Tab>
        <Tabs.Tab value="plum">Plum</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="apple">Apple panel</Tabs.Panel>
      <Tabs.Panel value="pear">Pear panel</Tabs.Panel>
      <Tabs.Panel value="plum">Plum panel</Tabs.Panel>
    </Tabs>
  );
}

test('uncontrolled tabs switch the panel when the user clicks a tab', async () => {
  await render(<Fruits defaultValue="apple" />);

  await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Apple panel');

  await page.getByRole('tab', { name: 'Pear' }).click();

  await expect.element(page.getByRole('tab', { name: 'Pear' })).toHaveAttribute('aria-selected', 'true');
  await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Pear panel');
});

test('controlled tabs report the click but show only what the parent passes in value', async () => {
  const onChange = vi.fn();
  await render(<Fruits value="apple" onChange={onChange} />);

  await page.getByRole('tab', { name: 'Plum' }).click();

  expect(onChange).toHaveBeenCalledWith('plum');
  await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Apple panel');
});

test('controlled tabs follow the parent when it changes value', async () => {
  const screen = await render(<Fruits value="apple" />);

  await screen.rerender(<Fruits value="pear" />);

  await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Pear panel');
});

test('arrow keys move selection and focus between tabs, wrapping around the ends', async () => {
  await render(<Fruits defaultValue="apple" />);
  await page.getByRole('tab', { name: 'Apple' }).click();

  await userEvent.keyboard('{ArrowRight}');
  await expect.element(page.getByRole('tab', { name: 'Pear' })).toHaveFocus();
  await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Pear panel');

  await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
  await expect.element(page.getByRole('tab', { name: 'Plum' })).toHaveFocus();
  await expect.element(page.getByRole('tabpanel')).toHaveTextContent('Plum panel');
});

test('only the selected tab is reachable with the Tab key', async () => {
  await render(<Fruits defaultValue="pear" />);

  await userEvent.keyboard('{Tab}');

  await expect.element(page.getByRole('tab', { name: 'Pear' })).toHaveFocus();
});

test('without a selected tab the first tab is still reachable with the Tab key', async () => {
  await render(<Fruits />);

  await userEvent.keyboard('{Tab}');

  await expect.element(page.getByRole('tab', { name: 'Apple' })).toHaveFocus();
});
