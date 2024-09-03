import React from 'react';
import { render } from '@testing-library/react';
import { Typography } from '.';

describe('Typography component', () => {
  test('render component', () => {
    const { getByText } = render(<Typography />);
    expect(getByText('caption2')).toBeInTheDocument();
  });
});
