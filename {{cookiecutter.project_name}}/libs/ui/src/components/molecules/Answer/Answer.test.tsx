import React from 'react';
import { render } from '@testing-library/react';
import { MessageType } from '../../../types';
import { Answer } from '.';

describe('Answer component', () => {
  test('renders text type Answer component', () => {
    const response = '<span>Response</span>';
    const { getByText } = render(<Answer>{response}</Answer>);
    expect(getByText(response)).toBeInTheDocument();
  });
  test('renders error type Answer component', () => {
    const response = '<span>Error</span>';
    const { getByText } = render(<Answer type={MessageType.error}>{response}</Answer>);
    expect(getByText(response)).toBeInTheDocument();
  });
  test('renders loading type Answer component', () => {
    const { container } = render(<Answer type={MessageType.responds} />);
    expect(container.querySelector('div.loader')).toBeInTheDocument();
  });
});
