import { useEffect, useRef } from 'react';

export function useAtBottom<T>(dependency: T[]) {
  const bottomRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dependency]);

  return bottomRef;
}
