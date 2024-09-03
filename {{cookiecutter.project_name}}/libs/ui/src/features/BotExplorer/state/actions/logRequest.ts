import { StoreApi } from 'zustand/vanilla';
import { BotExplorerStoreState } from '../store';
import { LogRequest, Log } from '../../types/Log';

export default (store: StoreApi<BotExplorerStoreState>) =>
  ({ id, time, baseURL, data, url, method }: LogRequest) => {
    const { logs } = store.getState();
    const newEvent: Log = {
      id,
      baseURL,
      url,
      method: method?.toUpperCase(),
      time,
      payload: [
        {
          type: 'request',
          body: data,
        },
      ],
    };
    store.setState({ logs: [...logs, newEvent], isPending: true });
  };
