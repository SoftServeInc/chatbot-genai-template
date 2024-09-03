import React from 'react';
import { render } from '@testing-library/react';
import { Question } from '.';

describe('Question component', () => {
  test('renders component correctly', () => {
    const question = 'question';
    const { getByText } = render(
      <Question>
        <span>{question}</span>
      </Question>,
    );
    expect(getByText(question)).toBeInTheDocument();
  });
});
