import React from 'react';
import { render } from '@testing-library/react';
import { UserInfo } from '.';

describe('UserInfo component', () => {
  test('renders component correctly', () => {
    const username = 'username';
    const { getByText } = render(<UserInfo username={username} />);
    expect(getByText(username)).toBeInTheDocument();
  });
});
