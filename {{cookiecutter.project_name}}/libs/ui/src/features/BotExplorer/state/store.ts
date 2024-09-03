import { StateCreator } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { ZUSTAND_DEVTOOLS_ENABLED } from '../../../constants';
import { createSelectors } from '../../../utils';

import { Log, LogRequest, LogResponse, Payload } from '../types/Log';
import logResponse from './actions/logResponse';
import logRequest from './actions/logRequest';
import selectLog from './actions/selectLog';

export interface BotExplorerStoreState {
  logs: Log[];
  selected: {
    logId: string;
    data: Payload;
  } | null;
  isPending: boolean;
  logResponse: (options: LogResponse) => void;
  logRequest: (request: LogRequest) => void;
  selectLog: (id: string, type: string, eventId?: string) => void;
  resetState: () => void;
}

export const defaultState = {
  logs: [],
  selected: null,
  isPending: false,
};

const createBotExplorerSlice: StateCreator<
  BotExplorerStoreState,
  [
    ['zustand/immer', never],
    ['zustand/devtools', unknown],
    ['zustand/subscribeWithSelector', never],
  ]
> = (set, get, api) => ({
  ...defaultState,
  logResponse: logResponse(api),
  logRequest: logRequest(api),
  selectLog: selectLog(api),
  resetState: () => set({ ...defaultState }),
});

export const useBotExplorerStore = createSelectors(
  createWithEqualityFn<BotExplorerStoreState>()(
    immer(
      devtools(subscribeWithSelector(createBotExplorerSlice), {
        enabled: ZUSTAND_DEVTOOLS_ENABLED,
        name: 'activity_logger_store',
      }),
    ),
  ),
);
