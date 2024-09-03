import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BotExplorer } from '.';

describe('BotExplorer component', () => {
  test('renders Default View', async () => {
    const { getByText } = render(<BotExplorer />);
    await waitFor(() =>
      expect(getByText('I can help you with lots of things')).toBeInTheDocument(),
    );
  });
});
