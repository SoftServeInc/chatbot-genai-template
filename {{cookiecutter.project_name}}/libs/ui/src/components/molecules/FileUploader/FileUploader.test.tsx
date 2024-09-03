import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploader } from '.';

describe('FileUploader component', () => {
  const fileUploaderProps = {
    onChange: jest.fn(),
    onRemove: jest.fn(),
  };
  const file = new File(['foo'], 'document.pdf', { type: 'application/pdf' });

  test('renders component in regular mode correctly', () => {
    const { getByText } = render(<FileUploader {...fileUploaderProps} />);
    expect(getByText('Choose file')).toBeInTheDocument();
  });

  test('should show preview after file is uploaded', async () => {
    const user = userEvent.setup();
    const { container, getByText } = render(<FileUploader {...fileUploaderProps} />);
    const input = container.querySelector('input');
    if (input) {
      await user.upload(input, file);
    }

    await waitFor(() => expect(fileUploaderProps.onChange).toHaveBeenCalled);
    expect(getByText('document.pdf')).toBeInTheDocument();
  });

  test('should show uploader after file was removed', async () => {
    const user = userEvent.setup();
    const { container, getByTestId, getByText } = render(<FileUploader {...fileUploaderProps} />);
    const input = container.querySelector('input');
    if (input) {
      await user.upload(input, file);
    }
    await user.click(getByTestId('remove-file'));
    await waitFor(() => expect(fileUploaderProps.onRemove).toHaveBeenCalled);
    expect(getByText('Choose file')).toBeInTheDocument();
  });
});
