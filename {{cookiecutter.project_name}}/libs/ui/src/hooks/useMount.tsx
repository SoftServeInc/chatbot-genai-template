import { type EffectCallback, useEffect, useRef } from 'react';

export const useMount = (effect: EffectCallback) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      return effect();
    }

    mounted.current = true;

    return () => {};
  }, [mounted, effect]);
};
