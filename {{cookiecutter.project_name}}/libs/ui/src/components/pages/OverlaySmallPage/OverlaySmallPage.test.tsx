import React from 'react';
import { render } from '@testing-library/react';
import { OverlaySmallPage } from '.';

describe('OverlaySmallPage component', () => {
  test('renders OverlaySmallPage', () => {
    const { getByText } = render(<OverlaySmallPage />);
    expect(getByText('Chatbot Small Overlay')).toBeInTheDocument();
  });
});
