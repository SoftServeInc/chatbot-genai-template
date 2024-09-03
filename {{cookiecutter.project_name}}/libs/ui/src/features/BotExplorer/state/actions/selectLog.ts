import { StoreApi } from 'zustand/vanilla';
import { BotExplorerStoreState } from '../store';
import { Payload } from '../../types/Log';

export default (store: StoreApi<BotExplorerStoreState>) =>
  (id: string, type: string, eventId?: string) => {
    const { logs } = store.getState();
    const info = logs.find((log) => log.id === id);
    if (info?.payload) {
      // const data = info.payload.reduce((acc, next) => {
      //   if (next.type === type && next.id === eventId) {
      //     return next;
      //   }
      //   return acc;
      // }, null);
      const data = info.payload.find((next) => next.type === type && next.id === eventId) || null;
      store.setState({
        selected: {
          logId: id,
          data: data as Payload,
        },
      });
    }
  };
