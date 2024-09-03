import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BotExplorerConfigDialog } from '.';

describe('BotExplorerConfigDialog component', () => {
  test('renders Default View', async () => {
    const props = {
      options: {
        baseURL: 'baseURL',
        accessToken: 'accessToken',
      },
      onSubmit: jest.fn(),
      open: true,
    };
    const { getByText } = render(<BotExplorerConfigDialog {...props} />);
    await waitFor(() => expect(getByText('Configure Bot')).toBeInTheDocument());
  });
});
