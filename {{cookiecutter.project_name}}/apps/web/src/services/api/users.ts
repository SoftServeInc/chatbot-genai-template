import { AuthInfo, Credentials, UserInfo } from '@/types/Users';
import { AUTH_TOKEN_KEY } from '../../constants';
import { api } from 'ui/src/api/client/index';

export async function login({ username, password }: Credentials): Promise<AuthInfo> {
  const { data } = await api.post('/users/login', { data: { username, password } });
  const auth: AuthInfo = data.data;
  sessionStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(auth.token));
  return auth;
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function agreeTerms(id: string): Promise<void> {
  await api.post(`/terms/${id}/agree`);
}

export async function getProfileInfo(): Promise<UserInfo | null> {
  try {
    const { data } = await api.get('/users/me');
    const response = data.data;
    return response;
  } catch (error) {
    return null;
  }
}
