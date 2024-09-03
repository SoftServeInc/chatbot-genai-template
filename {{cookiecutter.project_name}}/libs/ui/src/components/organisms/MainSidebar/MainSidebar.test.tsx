import React from 'react';
import { render } from '@testing-library/react';
import { MainSidebar, MainSideBarHeader, MainSideBarFooter } from '.';

describe('MainSidebar component', () => {
  test('renders  children of MainSidebar', () => {
    const child = 'Child';
    const { getByText } = render(
      <MainSidebar>
        <span>{child}</span>
      </MainSidebar>,
    );
    expect(getByText(child)).toBeInTheDocument();
  });
  test('renders  children of MainSideBarHeader', () => {
    const child = 'Child';
    const { getByText } = render(
      <MainSideBarHeader>
        <span>{child}</span>
      </MainSideBarHeader>,
    );
    expect(getByText(child)).toBeInTheDocument();
  });
  test('renders  children of MainSideBarFooter', () => {
    const child = 'Child';
    const { getByText } = render(
      <MainSideBarFooter>
        <span>{child}</span>
      </MainSideBarFooter>,
    );
    expect(getByText(child)).toBeInTheDocument();
  });
});
