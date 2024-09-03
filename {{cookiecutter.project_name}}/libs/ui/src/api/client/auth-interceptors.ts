import { AxiosResponse, AxiosError } from 'axios';
import { CustomHeaders } from '../custom-headers';
import { api } from './index';

export default function addAuthInterceptors(AUTH_TOKEN_KEY: string, logout: () => void) {
  api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const { headers } = config;

    if (headers) {
      headers.Authorization = token ? `Bearer ${JSON.parse(token)}` : '';
    }

    if (headers[CustomHeaders.OmitAuthToken]) {
      delete headers.Authorization;
      delete headers[CustomHeaders.OmitAuthToken];
    }

    return Object.assign(config, {
      headers,
    });
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const networkErrorCodes = ['ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK'];
      const { config, code, response } = error;

      if (error.response?.status === 401) {
        await logout();
        window.location.pathname = '/auth';
        // eslint-disable-next-line no-console
        console.error('[Auth]: Sesssion expired, please relogin');
      }

      if (
        config &&
        config.isTriggeredByUser &&
        ((code && networkErrorCodes.includes(code)) || (response && response?.status >= 500))
      ) {
        // TODO: instead of a console log we should show an error notification to the user
        // eslint-disable-next-line no-console
        console.error('Something went wrong. Please try again later');
      }

      return Promise.reject(error);
    },
  );
}
