import React from 'react';
import { render } from '@testing-library/react';
import { Conversation } from '.';

describe('Conversation component', () => {
  test('renders capabilities for empty conversation', () => {
    const capabilities = [{ question: 'name1' }, { question: 'name2' }];
    const { getByText } = render(<Conversation capabilities={capabilities} />);
    expect(getByText(capabilities[0].question)).toBeInTheDocument();
    expect(getByText(capabilities[1].question)).toBeInTheDocument();
  });
  test('renders children of conversation', () => {
    const child = 'Child';
    const { getByText } = render(
      <Conversation>
        <span>{child}</span>
      </Conversation>,
    );
    expect(getByText(child)).toBeInTheDocument();
  });
});
