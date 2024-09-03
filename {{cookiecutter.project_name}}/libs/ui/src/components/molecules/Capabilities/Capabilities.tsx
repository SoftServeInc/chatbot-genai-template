import { cn } from '../../../lib/utils';
import { Capability } from '../../../types';

interface CapabilitiesProps {
  data: Capability[];
  onCapabilityClick?: (prompt: string) => void;
}

export function Capabilities({ data, onCapabilityClick }: CapabilitiesProps) {
  if (!data) {
    return null;
  }

  return (
    <div
      className={cn(
        'border border-blue-gray-100 border-dashed max-w-xl rounded-[12px] mx-auto p-3',
      )}
    >
      <figcaption className="text-xl/8 font-semibold tracking-tight dark:text-black whitespace-nowrap">
        Try to ask ...
      </figcaption>
      <div className="flex justify-start items-start content-start flex-wrap gap-2">
        {data.map(({ question }) => (
          <button
            type="button"
            onClick={() =>
              onCapabilityClick && onCapabilityClick(question.replace(/<[^>]*>?/gm, ''))
            }
            className="py-2 px-1.5 bg-blue-75 rounded-[6px] text-sm/[12px] cursor-pointer hover:bg-blue-50 dark:text-black"
          >
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: question }} />
          </button>
        ))}
      </div>
    </div>
  );
}
