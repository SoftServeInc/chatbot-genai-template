import React from 'react';
import { render } from '@testing-library/react';
import { Icon } from '.';
import { IconName } from './enums/icon';

describe('Icon component', () => {
  test('render component with correct name prop', () => {
    const { container } = render(<Icon name={IconName.bot} />);
    const use = container.querySelector('use');
    expect(use?.getAttribute('href')).toBe('sprite.svg#bot.icon');
  });
});
