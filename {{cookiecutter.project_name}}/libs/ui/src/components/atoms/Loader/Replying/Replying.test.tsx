import React from 'react';
import { render } from '@testing-library/react';
import { Replying } from './Replying';

describe('Replying Loader component', () => {
  test('render component', () => {
    const { container } = render(<Replying />);
    expect(container.querySelector('div.loader')).toBeInTheDocument();
  });
});
