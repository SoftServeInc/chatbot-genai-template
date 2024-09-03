import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Frame } from '.';

describe('Frame component', () => {
  test('renders default View', async () => {
    const router = createBrowserRouter([{ element: <Frame />, path: '/' }]);
    const { getByText } = render(<RouterProvider router={router} />);
    await waitFor(() => expect(getByText('Gen AI Knowledge')).toBeInTheDocument());
  });
});
