import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BotExplorerConfigForm } from '.';

describe('BotExplorerConfigForm component', () => {
  test('renders Default View', async () => {
    const props = {
      options: {
        baseURL: 'baseURL',
        accessToken: 'accessToken',
      },
      onSubmit: jest.fn(),
    };
    const { getByText } = render(<BotExplorerConfigForm {...props} />);
    await waitFor(() => expect(getByText('Open Bot')).toBeInTheDocument());
  });
});
