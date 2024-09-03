import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ResponseRequestLogger } from '.';
import { Payload } from '../../types';

describe('ResponseRequestLogger component', () => {
  test('renders Default View', async () => {
    const props = {
      data: [
        {
          id: 'log_Id',
          baseURL: 'log-url',
          method: 'method',
          url: 'log-url',
          payload: [
            {
              type: 'event',
              body: { time: 'now' },
            } as Payload,
          ],
          time: {
            startTime: null,
            endTime: null,
          },
        },
      ],
      onSelect: jest.fn(),
    };
    const { getByText } = render(<ResponseRequestLogger {...props} />);
    await waitFor(() => expect(getByText('Log View')).toBeInTheDocument());
  });
});
