import React from 'react';
import { render } from '@testing-library/react';
import { NavigationMenu } from '.';
import { IconName } from '../../atoms/Icon/enums/icon';

describe('NavigationMenu component', () => {
  test('renders caption passed via props', () => {
    const navigationProps = {
      caption: {
        text: 'caption',
      },
      navigation: [],
    };
    const { getByText } = render(<NavigationMenu {...navigationProps} />);
    expect(getByText(navigationProps.caption.text)).toBeInTheDocument();
  });
  test('renders LINKS passed via props', () => {
    const icon = IconName.bot;
    const navigationProps = {
      navigation: [
        {
          to: '/',
          title: 'Home',
          details: 'home page',
          icon,
        },
        {
          to: '/about',
          title: 'About',
        },
      ],
    };
    const { getByText, container } = render(<NavigationMenu {...navigationProps} />);
    const use = container.querySelector('use');
    expect(use?.getAttribute('href')).toBe(`sprite.svg#${icon}.icon`);
    expect(getByText(navigationProps.navigation[1].title)).toBeInTheDocument();
  });
});
