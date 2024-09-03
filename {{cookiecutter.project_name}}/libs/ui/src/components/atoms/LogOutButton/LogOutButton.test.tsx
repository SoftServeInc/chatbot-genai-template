import React from 'react';
import { render } from '@testing-library/react';
import { LogOutButton } from '.';

describe('LogOutButton component', () => {
  test('render component', () => {
    const { getByText } = render(
      <LogOutButton>
        <span>LOG OUT</span>
      </LogOutButton>,
    );
    expect(getByText('LOG OUT')).toBeInTheDocument();
  });
});
