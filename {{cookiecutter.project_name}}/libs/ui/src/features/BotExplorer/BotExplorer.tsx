import { useState } from 'react';
import { Button } from '../../lib';
import { PageLayout, PageLayoutHeader } from '../../components/templates';
import { BotExplorerConfigDialog } from './components';
import { Assistant } from '../Assistant';
import { BotExplorerConfigType } from './types/Config';
import { ActivityLogger } from './components/ActivityLogger/ActivityLogger';
import { BotExplorerConfig } from './api/bot-exporer-config';

interface BotExplorerProps {
  onChangeConfig?: (applied: boolean) => void;
}

export function BotExplorer({ onChangeConfig }: BotExplorerProps) {
  const config = BotExplorerConfig.get();
  const [open, setOpen] = useState(!config.baseURL.trim());
  const [willReset, setWillReset] = useState<boolean>(false);

  const handleOpening = () => setOpen(!open);

  const handleSubmit = (modifiedConfig: BotExplorerConfigType, resetEnabled: boolean) => {
    BotExplorerConfig.create(modifiedConfig);
    setWillReset(resetEnabled);
    if (onChangeConfig) {
      onChangeConfig(resetEnabled);
    }

    setOpen(false);
  };

  const handleAfterWidgetReset = () => {
    setWillReset(false);
  };

  return (
    <PageLayout>
      <PageLayoutHeader title="Bot Explorer">
        <div className="w-full border-l ml-5 pl-5 dark:text-black">
          <p className="max-w-[60rem] min-w-0 flex">
            <strong className="min-w-fit">URL:</strong>
            <span className="ml-1 text-ellipsis overflow-hidden whitespace-nowrap">
              {config.baseURL}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          className="dark:bg-transparent dark:text-black"
          onClick={handleOpening}
        >
          Configure Bot
        </Button>
      </PageLayoutHeader>
      <div className="flex flex-1 min-h-0">
        <Assistant
          reset={{
            enabled: willReset,
            onAfterReset: handleAfterWidgetReset,
          }}
          styles={{
            header: 'text-xl/8 font-semibold tracking-tight',
            chat: 'ml-auto border-r min-w-[50%]',
          }}
        />
        <ActivityLogger reset={willReset} onAfterReset={handleAfterWidgetReset} />
      </div>
      <BotExplorerConfigDialog
        options={config}
        open={open}
        onSubmit={handleSubmit}
        onClose={handleOpening}
      />
    </PageLayout>
  );
}
