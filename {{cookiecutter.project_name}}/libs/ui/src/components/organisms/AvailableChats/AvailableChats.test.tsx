import React from 'react';
import { render } from '@testing-library/react';
import { AvailableChats } from '.';

describe('AvailableChats component', () => {
  const chatProps = {
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
    actions: {
      onSelect: jest.fn(),
      onCreate: jest.fn(),
      onRemove: jest.fn(),
      onRename: jest.fn(),
    },
  };
  test('renders chat passed via props', () => {
    const { getByText } = render(<AvailableChats {...chatProps} />);
    expect(getByText(chatProps.chats[0].title)).toBeInTheDocument();
  });
});
