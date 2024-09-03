import React from 'react';
import { render } from '@testing-library/react';
import { Avatar } from '.';

describe('Avatar component', () => {
  test('show display text if src not provided', () => {
    const { getByText } = render(<Avatar displaName="Test ALT" />);
    expect(getByText('Test ALT')).toBeInTheDocument();
  });
});
