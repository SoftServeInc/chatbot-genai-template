import { api } from './client/index';

export async function ping(): Promise<boolean> {
  try {
    const { data } = await api.get('ping');

    return !!data?.data?.pong;
  } catch (error) {
    return false;
  }
}

export async function noop(): Promise<boolean> {
  try {
    await api.get('/noop');

    return true;
  } catch {
    return false;
  }
}

export async function pingToConsole() {
  const ok = await ping();

  // eslint-disable-next-line no-console
  console.info(`API is ${ok ? 'online' : 'offline'}`);
}
