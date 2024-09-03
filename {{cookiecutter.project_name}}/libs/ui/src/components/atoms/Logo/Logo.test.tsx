import React from 'react';
import { render } from '@testing-library/react';
import { Logo } from '.';

describe('Logo component', () => {
  test('render component', () => {
    const { getByText } = render(<Logo />);
    expect(getByText('Logo-Dark-Opt-B.svg')).toBeInTheDocument();
  });
});
