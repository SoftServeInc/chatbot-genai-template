import { useEffect, useRef, useState } from 'react';
import { WidgetLayout } from '../../../../components/templates';
import { LogInfo } from './LogInfo';
import { Log } from '../../types/Log';

interface ResponseRequestLoggerProps {
  data: Log[];
  onSelect: (id: string, type: string, eventId?: string) => void;
}

export function ResponseRequestLogger({ data, onSelect }: ResponseRequestLoggerProps) {
  const bottomRef = useRef<null | HTMLLIElement>(null);
  const [logsAmount, setLogsAmount] = useState(0);

  useEffect(() => {
    if (data.length > logsAmount) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setLogsAmount(data.length);
    }
  }, [data.length, logsAmount]);

  return (
    <WidgetLayout title="Log View">
      <ul className="py-4">
        {data && data.length
          ? data.map((log) => <LogInfo key={log.id} {...log} onSelect={onSelect} />)
          : null}
        <li ref={bottomRef} className="h-px w-full" />
      </ul>
    </WidgetLayout>
  );
}
