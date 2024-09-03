import { v4 as uuid } from 'uuid';
import { cn } from '../../../../lib';
import { Log } from '../../types/Log';

interface LogInfoProps extends Log {
  onSelect: (id: string, type: string, eventId?: string) => void;
}

export function LogInfo({
  id,
  time,
  method,
  status,
  baseURL,
  url,
  payload,
  onSelect,
}: LogInfoProps) {
  return (
    <li key={id} className="font-mono text-sm tracking-tightest dark:text-black flex flex-col">
      <button
        type="button"
        onClick={() => onSelect(id, 'request')}
        className="relative w-full text-left pl-[6.75rem] pr-[1.19rem] cursor-pointer hover:bg-blue-gray-100"
      >
        <time className="absolute left-[1.19rem]" dateTime={time?.startTime?.toISOString()}>
          <span className="text-green-600">{`${time?.startTime?.toLocaleTimeString()}`}</span>
        </time>
        <strong
          className={cn(
            '',
            typeof status === 'string' || status === undefined || status >= 400
              ? 'text-red-600'
              : '',
          )}
        >
          {method}
        </strong>
        <strong
          className={cn(
            'ml-1',
            typeof status === 'string' || status === undefined || status >= 400
              ? 'text-red-600'
              : '',
          )}
        >
          {status}
        </strong>
        <span className="ml-1">{baseURL}</span>
        <span className="">{url}</span>
      </button>
      {payload.map((data) => {
        if (/event|response/g.test(data.type)) {
          return (
            <button
              type="button"
              key={`[${data.type}}:${uuid()}`}
              onClick={() => onSelect(id, data.type, data?.id)}
              className="relative flex flex-1 items-center text-left pl-[6.75rem] pr-[1.19rem] cursor-pointer hover:bg-blue-gray-100"
            >
              <time className="absolute left-[1.19rem]" dateTime={time?.endTime?.toISOString()}>
                <span className="text-green-600">{`${time?.endTime?.toLocaleTimeString()}`}</span>
              </time>
              <span>{' <- '}</span>
              <span className="ml-1 flex-1 text-ellipsis overflow-hidden whitespace-nowrap">{`${
                data.body ? 'Response Object' : ''
              }`}</span>
            </button>
          );
        }
        return null;
      })}
    </li>
  );
}
