import React from 'react';
import { render } from '@testing-library/react';
import { Capabilities } from '.';

describe('Capabilities component', () => {
  test('renders Capabilities with all props correctly', () => {
    const capabilityMock = [{ question: 'cap1' }];
    const { getByText } = render(<Capabilities data={capabilityMock} />);
    expect(getByText(capabilityMock[0].question)).toBeInTheDocument();
  });
});
