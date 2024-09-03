import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Feedback } from '.';

describe('Feedback component', () => {
  test('renders title of Feedback component', () => {
    const { getByText } = render(<Feedback />);
    expect(getByText('Describe your rate')).toBeInTheDocument();
  });

  test('renders quickOption of Feedback component', () => {
    const { getByText } = render(<Feedback quickOptions={['awosome']} />);
    expect(getByText('awosome')).toBeInTheDocument();
  });

  test('іShould disappear on close button click', async () => {
    const user = userEvent.setup();
    const { queryByText, getByText, getByTestId } = render(<Feedback />);
    expect(getByText('Describe your rate')).toBeInTheDocument();
    await user.click(getByTestId('close-feedback'));
    await waitFor(() => expect(expect(queryByText('Describe your rate')).not.toBeInTheDocument()));
  });

  test('іShould not submit if feedback is empty', async () => {
    const props = {
      onSubmit: jest.fn(),
    };
    const user = userEvent.setup();
    const { getByTestId } = render(<Feedback {...props} />);
    await user.click(getByTestId('submit-feedback'));
    await waitFor(() => expect(props.onSubmit).not.toHaveBeenCalled);
  });

  test('іShould show Thank You after submit', async () => {
    const props = {
      onSubmit: jest.fn(),
    };
    const user = userEvent.setup();
    const { queryByText, getByTestId } = render(<Feedback {...props} />);
    await user.type(getByTestId('feedback-textarea'), 'feedback');
    await user.click(getByTestId('submit-feedback'));
    await waitFor(() => expect(props.onSubmit).toHaveBeenCalled);
    await waitFor(() => expect(expect(queryByText('Thank you for feedback!')).toBeInTheDocument()));
  });
});
