import { useEffect } from 'react';
import { ResponseRequestLogger, Inspector } from '../ResponseRequestLogger';
import { useBotExplorerStore } from '../../state/store';
import { ApplyInterceptors } from '../../api/interceptors';

interface ActivityLoggerProps {
  reset?: boolean;
  onAfterReset?: () => void;
}

export function ActivityLogger({ reset = false, onAfterReset }: ActivityLoggerProps) {
  const { logs, selected, selectLog, resetState } = useBotExplorerStore();

  useEffect(() => {
    resetState();
    ApplyInterceptors();
  }, [resetState]);

  useEffect(() => {
    if (reset) {
      resetState();
      if (onAfterReset) {
        onAfterReset();
      }

      return () => {
        resetState();
      };
    }

    return () => {
      resetState();
    };
  }, [resetState, reset, onAfterReset]);

  return (
    <aside className="flex flex-col flex-1 divide-y bg-blue-gray-25">
      <Inspector payload={selected?.data?.body as object} />
      <ResponseRequestLogger data={logs} onSelect={selectLog} />
    </aside>
  );
}
