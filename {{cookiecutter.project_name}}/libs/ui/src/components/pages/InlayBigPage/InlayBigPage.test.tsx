import React from 'react';
import { render } from '@testing-library/react';
import { InlayBigPage } from '.';

describe('InlayBigPage component', () => {
  test('renders InlayBigPage', () => {
    const { getByText } = render(<InlayBigPage />);
    expect(getByText('ChatBot Big Inlay')).toBeInTheDocument();
  });
});
