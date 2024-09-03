import { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { createSelectors } from '@/utils/createSelectors';
import { Credentials, UserInfo, TermsInfo } from '@/types/Users';
import { ZUSTAND_DEVTOOLS_ENABLED } from '@/constants';

import login from './actions/login';
import logout from './actions/logout';
import agreeTerms from './actions/agreeTerms';

export interface AuthStoreState {
  userProfile: UserInfo | null;
  terms: TermsInfo | null;
  login: (credentials: Credentials) => Promise<boolean>;
  logout: () => void;
  agreeTerms: () => Promise<boolean>;
}

const createAuthSlice: StateCreator<
  AuthStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
    ['zustand/persist', unknown],
  ]
> = (set, get, api) => ({
  userProfile: null,
  terms: null,
  login: login(api),
  logout: logout(api),
  agreeTerms: agreeTerms(api),
});

export const useAuthStore = createSelectors(
  createWithEqualityFn<AuthStoreState>()(
    immer(
      devtools(
        subscribeWithSelector(
          persist(createAuthSlice, {
            name: 'auth_store',
          }),
        ),
        {
          enabled: ZUSTAND_DEVTOOLS_ENABLED,
          name: 'auth_store',
        },
      ),
    ),
  ),
);
