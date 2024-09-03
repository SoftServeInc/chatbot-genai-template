import { BOT_EXPLORER_CONFIG_KEY } from '../../../constants';
import { BotExplorerConfigType } from '../types/Config';

export const BotExplorerConfig = {
  get: (): BotExplorerConfigType => {
    const stored = localStorage.getItem(BOT_EXPLORER_CONFIG_KEY);
    const parsed = stored ? JSON.parse(stored) : null;

    return {
      baseURL: parsed ? parsed.baseURL : '',
      accessToken: parsed ? parsed.accessToken : '',
      emulatorInUse: !!parsed,
    };
  },
  create: (config: BotExplorerConfigType) => {
    localStorage.setItem(BOT_EXPLORER_CONFIG_KEY, JSON.stringify(config));
  },
  remove: () => {
    localStorage.removeItem(BOT_EXPLORER_CONFIG_KEY);
  },
};
