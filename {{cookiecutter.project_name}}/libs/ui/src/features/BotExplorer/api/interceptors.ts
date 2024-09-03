import { v4 as uuid } from 'uuid';
import { BotExplorerConfig } from './bot-exporer-config';
import { useBotExplorerStore } from '../state/store';
import { api } from '../../../api/client/index';
import { LogRequest, LogResponse } from '../types/Log';

const log = {
  request: (config: LogRequest) => {
    const { logRequest } = useBotExplorerStore.getState();
    logRequest(config);
  },
  response: (response: LogResponse) => {
    const { logResponse } = useBotExplorerStore.getState();
    logResponse(response);
  },
};

interface RequestData {
  id: string;
  time: {
    startTime: Date;
    endTime: Date | null;
  };
}

interface ApiError {
  error: {
    status: number;
    type: string;
    title: string;
    details: string[];
  };
}

export function ApplyInterceptors() {
  const { emulatorInUse } = BotExplorerConfig.get();
  const RequestDataMap = new Map<string, RequestData>();

  api.interceptors.request.use((config) => {
    if (config && emulatorInUse) {
      const { headers } = config;
      const { baseURL, accessToken } = BotExplorerConfig.get();
      const id = uuid();
      const customData: RequestData = {
        id,
        time: {
          startTime: new Date(),
          endTime: null,
        },
      };

      RequestDataMap.set(id, customData);
      log.request({
        ...customData,
        url: config.url || '',
        baseURL,
        method: config.method || '',
        data: config.data,
      });

      if (headers) {
        headers.Authorization = `Bearer ${accessToken}`;
        headers['X-Custom-RequestId'] = customData.id;
      }

      return Object.assign(config, {
        baseURL,
        headers,
      });
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => {
      if (response && emulatorInUse) {
        const requestId = response.config.headers['X-Custom-RequestId'];
        const customData = RequestDataMap.get(requestId);

        if (customData) {
          customData.time.endTime = new Date();

          log.response({
            ...customData,
            type: 'response',
            status: `${response.status}`,
            data: response.data,
          });

          RequestDataMap.delete(requestId);
        }
      }

      return response;
    },
    (error) => {
      if (error && emulatorInUse) {
        const { config, code, status, message, response } = error;
        const customAPIError = (response?.data as ApiError)?.error;
        const requestId = config?.headers['X-Custom-RequestId'];
        const customData = RequestDataMap.get(requestId);

        if (customData) {
          customData.time.endTime = new Date();

          log.response({
            ...customData,
            type: 'error',
            status: `${customAPIError?.status || status || code}`,
            data: customAPIError || { message },
          });

          RequestDataMap.delete(requestId);
        }
      }

      return Promise.reject(error);
    },
  );
}
