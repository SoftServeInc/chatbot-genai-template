import { useState } from 'react';
import { cn, Button } from '../../../lib';
import { IconName, Icon } from '../../atoms';
import { ContentWireframe, PageLayout } from '../../templates';
import { Assistant } from '../../../features';

export function InlaySmallPage() {
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <PageLayout title="ChatBot Small Inlay">
      <div className="flex flex-1 min-h-0">
        <div className="relative flex flex-1">
          <ContentWireframe className="flex-1" />
          <Button
            className="py-2 pl-[0.9375rem] pr-[0.81rem] bg-blue-gray-500 hover:bg-blue-gray-500/[0.7] rounded-full text-sm/6 text-white font-semibold tracking-tightest absolute top-[2.69rem] right-[1.81rem]"
            variant="secondary"
            onClick={handleClick}
          >
            <Icon name={IconName.bot} fill="#fff" className="mr-2 h-6 w-6" />
            Contextual bot
          </Button>
        </div>
        <Assistant
          header={{
            title: 'Chatbot Assistant',
          }}
          styles={{
            header: 'text-xl/8 font-semibold tracking-tight',
            chat: cn(
              'ml-auto border-l transition-width ease max-w-[29.5625rem]',
              expanded ? 'w-[29.5625rem] min-w-0' : 'w-0 min-w-0 hidden',
            ),
          }}
        />
      </div>
    </PageLayout>
  );
}
