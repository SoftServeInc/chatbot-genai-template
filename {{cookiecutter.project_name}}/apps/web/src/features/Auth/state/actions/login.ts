import { StoreApi } from 'zustand/vanilla';
import { Credentials } from '@/types/Users';
import { login } from '@/services/api/users';
import { AuthStoreState } from '../store';

export default (store: StoreApi<AuthStoreState>) => async (credentials: Credentials) => {
  try {
    const auth = await login(credentials);
    store.setState({ userProfile: auth.user, terms: auth.terms ?? null });
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to login:', error);
    return false;
  }
};
