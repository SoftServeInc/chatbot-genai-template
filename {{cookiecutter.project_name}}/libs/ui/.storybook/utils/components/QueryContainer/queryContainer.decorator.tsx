import { StoryFn } from '@storybook/react';
import { QueryContainer, QueryContainerSize } from '..';

export const QueryContainerDecorator = (Story: StoryFn, name: string, size: QueryContainerSize) => (
  <QueryContainer name={name} size={size}>
    <Story />
  </QueryContainer>
);
