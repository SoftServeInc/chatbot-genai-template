import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatsList } from '.';

describe('ChatsList component', () => {
  const chatListProps = {
    selected: 'parentId',
    chats: [
      {
        id: 'parentId',
        user_id: 'parentId',
        title: 'chat1',
        messages: [],
        created_at: '2024-02-12T11:25:26.866069+00:00',
        modified_at: '2024-02-12T11:25:26.866069+00:00',
        details: 'this is nice chat',
      },
    ],
    onSelect: jest.fn(),
    onRemove: jest.fn(),
    onRename: jest.fn(),
  };

  test('renders chats in ChatsList correctly', () => {
    const { getByText } = render(<ChatsList {...chatListProps} />);
    expect(getByText(chatListProps.chats[0].title)).toBeInTheDocument();
    expect(getByText(chatListProps.chats[0].details)).toBeInTheDocument();
  });

  test('renders empty ChatsList correctly', () => {
    const props = { ...chatListProps };
    props.chats = [];
    const { getByText } = render(<ChatsList {...props} />);
    expect(
      getByText('Press the New Channel button to start your GEN AI exploration.'),
    ).toBeInTheDocument();
  });

  test('should call select chat on click', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<ChatsList {...chatListProps} />);
    await user.click(getByText(chatListProps.chats[0].title));
    await waitFor(() => expect(chatListProps.onSelect).toHaveBeenCalled);
  });
});
