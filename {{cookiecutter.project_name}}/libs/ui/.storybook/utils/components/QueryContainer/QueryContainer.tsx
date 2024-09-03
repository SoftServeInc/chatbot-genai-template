import { ReactNode } from 'react';
import { QueryContainerSize } from './enums/queryContainerSize';

interface QueryContainerProps {
  name: string;
  size: QueryContainerSize;
  children: ReactNode | ReactNode[];
}

export function QueryContainer({ name, size, children }: QueryContainerProps) {
  return (
    <div className={`@container/${name}`} style={{ width: size + 'px' }}>
      {children}
    </div>
  );
}
