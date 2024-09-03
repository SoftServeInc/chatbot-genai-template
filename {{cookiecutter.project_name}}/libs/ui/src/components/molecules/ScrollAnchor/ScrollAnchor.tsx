import { useAtBottom } from '../../../hooks/useAtBottom';

interface ScrollAnchorProps {
  trackVisibility?: boolean | number;
}

export function ScrollAnchor({ trackVisibility }: ScrollAnchorProps) {
  const bottomRef = useAtBottom([trackVisibility]);

  return <div ref={bottomRef} className="h-px w-full" />;
}
