import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PopupView } from '.';
import { assistantMocks } from '../mocks';

describe('PopupView component', () => {
  test('renders PopupView', () => {
    const { getByText } = render(<PopupView {...assistantMocks} />);
    expect(getByText('AI')).toBeInTheDocument();
  });

  test('expand PopupView', async () => {
    const user = userEvent.setup();
    const { container, getByText } = render(<PopupView {...assistantMocks} />);
    const button = container.querySelector('button');
    if (button) {
      await user.click(button);
    }
    await waitFor(() =>
      expect(getByText(assistantMocks.chat!.messages[0].segments[0].content)).toBeInTheDocument(),
    );
  });
});
