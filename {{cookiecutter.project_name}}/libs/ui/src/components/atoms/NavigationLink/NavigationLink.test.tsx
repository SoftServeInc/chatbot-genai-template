import React from 'react';
import { render } from '@testing-library/react';
import { NavigationLink } from '.';

describe('NavigationLink component', () => {
  test('render component', () => {
    const lead = '/home';
    const title = 'Link';
    const details = 'details';
    const { getByText, getByRole } = render(
      <NavigationLink to={lead} title={title} details={details} />,
    );
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(details)).toBeInTheDocument();
    expect(getByRole('link').getAttribute('to')).toBe(lead);
  });
});
