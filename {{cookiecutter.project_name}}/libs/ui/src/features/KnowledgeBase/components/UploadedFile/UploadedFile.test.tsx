import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { FileStatuses } from '@/types';
import { UploadedFile } from '.';

describe('Frame component', () => {
  test('renders default View', async () => {
    const props = {
      id: '123',
      name: 'file',
      status: FileStatuses.completed,
      date: '01-01-2024',
      size: 1024,
      onRemove: jest.fn(),
      uploadStatus: { '12': { progress: 25, info: 'info' } },
    };
    const { getByText } = render(<UploadedFile {...props} />);
    await waitFor(() => expect(getByText('1.02 kB')).toBeInTheDocument());
  });
});
