import React from 'react';
import { render } from '@testing-library/react';
import { Default } from '.';
import { assistantMocks } from '../mocks';
import { MessageAuthor } from '../../../types';

describe('DefaultView component', () => {
  test('renders DefaultView', () => {
    const mocks = JSON.parse(JSON.stringify(assistantMocks));
    mocks.chat.messages[0].role = MessageAuthor.user;
    const { getByText } = render(<Default {...mocks} />);
    expect(getByText(assistantMocks.chat!.messages[0].segments[0].content)).toBeInTheDocument();
  });
});
