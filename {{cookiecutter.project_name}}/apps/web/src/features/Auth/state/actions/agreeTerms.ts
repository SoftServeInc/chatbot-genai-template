import { StoreApi } from 'zustand/vanilla';
import { agreeTerms } from '@/services/api/users';
import { AuthStoreState } from '../store';

export default (store: StoreApi<AuthStoreState>) => async () => {
  try {
    const { terms } = store.getState();
    if (!terms) {
      return false;
    }

    await agreeTerms(terms.id);
    terms.agreed = true;
    store.setState({ terms });
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to accept terms:', error);
    return false;
  }
};
