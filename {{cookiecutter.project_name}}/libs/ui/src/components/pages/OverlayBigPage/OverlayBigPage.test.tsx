import React from 'react';
import { render } from '@testing-library/react';
import { OverlayBigPage } from '.';

describe('OverlayBigPage component', () => {
  test('renders OverlayBigPage', () => {
    const { getByText } = render(<OverlayBigPage />);
    expect(getByText('Chatbot Big Overlay')).toBeInTheDocument();
  });
});
