import React from 'react';
import { render } from '@testing-library/react';
import { Chat, ChatFooter } from '.';

describe('Chat component', () => {
  const chatProps = {
    id: 'parentId',
    header: {
      title: 'chat1',
      className: 'class',
    },
    children: <ChatFooter>Chat Content</ChatFooter>,
  };
  test('renders chat passed via props', () => {
    const { getByText } = render(<Chat {...chatProps} />);
    expect(getByText(chatProps.header.title)).toBeInTheDocument();
  });
});
