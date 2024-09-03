import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Inspector } from '.';

describe('Inspector component', () => {
  test('renders Default View', async () => {
    const props = {
      payload: { unit: 'test' },
    };
    const { getByText } = render(<Inspector {...props} />);
    await waitFor(() => expect(getByText(`"${props.payload.unit}"`)).toBeInTheDocument());
  });
});
