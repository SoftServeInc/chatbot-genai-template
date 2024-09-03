import React from 'react';
import { render } from '@testing-library/react';
import { Input } from '.';

describe('Input component', () => {
  test('render component', () => {
    const { getByText } = render(<Input placeholder="Input TEST" />);
    expect(getByText('Input TEST')).toBeInTheDocument();
  });
});
