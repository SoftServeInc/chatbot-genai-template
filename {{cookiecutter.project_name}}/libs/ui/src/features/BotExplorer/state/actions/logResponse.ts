import { StoreApi } from 'zustand/vanilla';
import { BotExplorerStoreState } from '../store';
import { LogResponse, Payload, PayloadType } from '../../types/Log';

export default (store: StoreApi<BotExplorerStoreState>) =>
  ({ id, time, status, data, type }: LogResponse) => {
    const { logs } = store.getState();
    const updated = logs.map((log) => {
      if (log.id === id) {
        const numericStatus = Number(status);
        const payloadType: 'request' | 'response' | 'event' = type as PayloadType;
        const newPayload: Payload = {
          id: `${log.payload.length + 1}`,
          type: payloadType,
          body: data,
        };

        return {
          ...log,
          status: numericStatus, // Ensure this is a number
          time,
          payload: [...log.payload, newPayload],
        };
      }
      return log;
    });

    store.setState({ logs: updated, isPending: false });
  };
