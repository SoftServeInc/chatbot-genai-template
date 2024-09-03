import { shallow } from 'zustand/shallow';
import { useAuthStore, AuthStoreState } from '@/features/Auth/state/store';

export function useAuth() {
  const [login, logout, agreeTerms, userProfile, terms, isAuthenticated] = useAuthStore(
    (state: AuthStoreState) => [
      state.login,
      state.logout,
      state.agreeTerms,
      state.userProfile,
      state.terms,
      state.userProfile !== null && (state.terms === null || state.terms.agreed),
    ],
    shallow,
  );

  return { login, logout, agreeTerms, userProfile, terms, isAuthenticated };
}
