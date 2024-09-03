import React from 'react';
import { render } from '@testing-library/react';
import { PageLayout } from '.';

describe('PageLayout component', () => {
  test('renders PageLayout', () => {
    const child = 'layout child';
    const { getByText } = render(<PageLayout>{child}</PageLayout>);
    expect(getByText(child)).toBeInTheDocument();
  });
});
