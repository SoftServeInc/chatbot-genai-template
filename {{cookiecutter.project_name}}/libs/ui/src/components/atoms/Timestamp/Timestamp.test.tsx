import React from 'react';
import { render } from '@testing-library/react';
import { Timestamp } from '.';

describe('Timestamp component', () => {
  test('render component', () => {
    const stamp = '2024-02-12T11:25:26.866069+00:00';
    const { getByText } = render(<Timestamp>{stamp}</Timestamp>);
    expect(getByText('12:25 PM')).toBeInTheDocument();
  });
});
