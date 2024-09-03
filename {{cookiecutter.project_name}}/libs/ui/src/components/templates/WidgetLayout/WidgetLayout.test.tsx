import React from 'react';
import { render } from '@testing-library/react';
import { WidgetLayout } from '.';

describe('WidgetLayout component', () => {
  test('renders WidgetLayout', () => {
    const child = 'layout child';
    const title = 'title';
    const { getByText } = render(<WidgetLayout title={title}>{child}</WidgetLayout>);
    expect(getByText(child)).toBeInTheDocument();
    expect(getByText(title)).toBeInTheDocument();
  });
});
