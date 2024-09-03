import React from 'react';
import { render } from '@testing-library/react';
import { ThemeModeToggle } from '.';

describe('ThemeModeToggle component', () => {
  test('render component', () => {
    const { getAllByRole } = render(<ThemeModeToggle />);
    expect(getAllByRole('button').length).toBe(2);
  });
});
