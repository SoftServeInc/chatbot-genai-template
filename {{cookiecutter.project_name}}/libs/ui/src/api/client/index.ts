import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

import { ENVIRONMENT } from '../../constants';

export type ProgressEvent = AxiosProgressEvent;
export type RequestConfig = AxiosRequestConfig;

declare module 'axios' {
  interface AxiosRequestConfig {
    isTriggeredByUser?: boolean;
  }
}

export const api = axios.create({
  baseURL: ENVIRONMENT.VITE_API_BASE_URL,
  withCredentials: false,
  // timeout: 10000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8',
  },
});

export const setBaseURL = (url: string): void => {
  api.defaults.baseURL = url;
};
