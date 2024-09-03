import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InlaySmallPage } from '.';

describe('InlaySmallPage component', () => {
  test('renders InlaySmallPage', () => {
    const { getByText } = render(<InlaySmallPage />);
    expect(getByText('Contextual bot')).toBeInTheDocument();
  });

  test('expand Assistant', async () => {
    const user = userEvent.setup();
    const { container, getByText } = render(<InlaySmallPage />);
    const button = container.querySelector('button');
    if (button) {
      await user.click(button);
    }
    await waitFor(() => expect(getByText('Chatbot Assistant')).toBeInTheDocument());
  });
});
