import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptForm } from '.';

describe('PromptForm component', () => {
  const promptFormProps = {
    onSubmit: jest.fn(),
  };

  test('renders component in regular mode correctly', () => {
    const { container } = render(<PromptForm {...promptFormProps} />);
    expect(container.querySelector('input')).toBeInTheDocument();
    expect(container.querySelector('button')).toBeInTheDocument();
  });

  test('should call onSubmit with entered value', async () => {
    const user = userEvent.setup();
    const text = 'prompt';
    const { container } = render(<PromptForm {...promptFormProps} />);
    const input = container.querySelector('input');
    if (input) {
      await user.type(input, text);
    }
    const button = container.querySelector('button');
    if (button) {
      await user.click(button);
    }
    await waitFor(() => expect(promptFormProps.onSubmit).toHaveBeenCalledWith(text));
  });
});
