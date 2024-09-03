import React from 'react';
import { render } from '@testing-library/react';
import { ScrollAnchor } from '.';

describe('ScrollAnchor component', () => {
  test('renders component correctly', () => {
    const { container } = render(<ScrollAnchor />);
    expect(container.querySelector('div.h-px')).toBeInTheDocument();
  });
});
