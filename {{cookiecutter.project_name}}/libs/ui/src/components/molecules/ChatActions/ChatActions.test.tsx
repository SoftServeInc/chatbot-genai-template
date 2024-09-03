import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatActions } from '.';
import { IconName } from '../..';

describe('ChatActions component', () => {
  test('renders options in ChatActions correctly', async () => {
    const user = userEvent.setup();
    const chatActionsProps = {
      parentId: 'parentId',
      actions: [{ name: 'action1', icon: IconName.bot, action: () => {} }],
      className: 'class',
    };
    const { getByText, container } = render(<ChatActions {...chatActionsProps} />);
    const button = container.querySelector(`.${chatActionsProps.className}`);
    if (button) {
      await user.click(button);
    }
    expect(getByText(chatActionsProps.actions[0].name)).toBeInTheDocument();
  });
});
