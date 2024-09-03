import React from 'react';
import { render } from '@testing-library/react';
import { FilterChip } from './FilterChip';

describe('Chip component', () => {
  test('renders Chip inactive component', () => {
    const { getByText } = render(<FilterChip isActive={false} text="Test Chip" />);
    expect(getByText('Test Chip')).toBeInTheDocument();
  });

  test('renders Chip Active component', () => {
    const { getByText, getByTestId } = render(<FilterChip isActive text="Chip" />);
    expect(getByText('Chip')).toBeInTheDocument();
    expect(getByTestId('active-chip')).toBeVisible();
  });
});
