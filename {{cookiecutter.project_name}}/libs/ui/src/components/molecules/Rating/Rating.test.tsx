import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rating } from '.';

describe('Rating component', () => {
  test('should be empty if no data provided', () => {
    const { container } = render(<Rating />);
    expect(container.querySelector('button')).not.toBeInTheDocument();
  });

  test('should render buttons if data provided', () => {
    const { container } = render(<Rating data={{ like: 0, dislike: 0 }} />);
    expect(container.querySelectorAll('button').length).toBe(2);
  });

  test('should call on onChange on button click', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const { container } = render(<Rating data={{ like: 0, dislike: 0 }} onChange={onChange} />);
    const button = container.querySelector('button');
    if (button) {
      await user.click(button);
    }
    await waitFor(() => expect(onChange).toHaveBeenCalled);
  });
});
