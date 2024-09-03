import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidebarView } from '.';
import { assistantMocks } from '../mocks';

describe('SidebarView component', () => {
  test('renders SidebarView', () => {
    const { getByText } = render(<SidebarView {...assistantMocks} />);
    expect(getByText('AI')).toBeInTheDocument();
  });

  test('expand SidebarView', async () => {
    const user = userEvent.setup();
    const { container, getByText } = render(<SidebarView {...assistantMocks} />);
    const button = container.querySelector('button');
    if (button) {
      await user.click(button);
    }
    await waitFor(() =>
      expect(getByText(assistantMocks.chat!.messages[0].segments[0].content)).toBeInTheDocument(),
    );
  });
});
