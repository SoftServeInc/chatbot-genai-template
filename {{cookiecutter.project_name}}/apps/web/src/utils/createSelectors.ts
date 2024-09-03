import { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;

  type Selectors = {
    [K in keyof ReturnType<(typeof _store)['getState']>]: () => ReturnType<
      (typeof _store)['getState']
    >[K];
  };

  store.use = {} as Selectors;

  Object.keys(store.getState()).forEach((k) => {
    (store.use as Selectors)[k as keyof Selectors] = () => store((s) => s[k as keyof typeof s]);
  });

  return store;
};
