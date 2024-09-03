import React from 'react';
import { render } from '@testing-library/react';
import { Assistant } from '.';
import { assistantMocks } from './mocks';

describe('Assistant component', () => {
  test('renders Default View', () => {
    const { getByText } = render(<Assistant {...assistantMocks} />);
    expect(getByText(assistantMocks.header!.title)).toBeInTheDocument();
  });
});
