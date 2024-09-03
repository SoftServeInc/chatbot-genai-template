import { StoreApi } from 'zustand/vanilla';
import { logout } from '@/services/api/users';
import { AuthStoreState } from '../store';

export default (store: StoreApi<AuthStoreState>) => async () => {
  try {
    await logout();
    store.setState({ userProfile: null, terms: null });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to logout:', error);
  }
};
