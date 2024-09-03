import { ChangeEvent, FormEvent, ReactElement, useState, useRef } from 'react';
import { cn, Button, Checkbox } from '../../../../lib';
import { IconName, Input } from '../../../../components/atoms';
import { BotExplorerConfigType } from '../../types/Config';

export interface BotExplorerConfigFormProps {
  className?: string;
  children?: ReactElement;
  options: BotExplorerConfigType;
  onSubmit: (config: BotExplorerConfigType, resetEnabled: boolean) => void;
  withBotReset?: boolean;
}

export function BotExplorerConfigForm({
  options,
  className,
  children,
  onSubmit,
  withBotReset,
}: BotExplorerConfigFormProps) {
  const [config, updateConfig] = useState<BotExplorerConfigType>(options);
  const [canResetBot, setCanResetBot] = useState<boolean>(false);
  const [resetEnabled, setResetEnabled] = useState<boolean>(false);
  const inputWithTokeRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = () => {
    setResetEnabled(!resetEnabled);
  };

  const handleURLChange = (event: ChangeEvent<HTMLInputElement>) => {
    const state = { ...config, baseURL: event.target.value };
    setResetEnabled(true);
    setCanResetBot(false);
    updateConfig(state);
  };

  const handleTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    const state = { ...config, accessToken: event.target.value };
    setResetEnabled(false);
    setCanResetBot(event.target.value !== config.accessToken);
    updateConfig(state);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(config, resetEnabled);
  };

  const handleFocus = () => {
    if (inputWithTokeRef?.current) {
      inputWithTokeRef.current.select();
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn('px-[1.88rem] flex flex-col items-center', className)}
    >
      <Input
        type="text"
        value={config.baseURL}
        onChange={handleURLChange}
        icon={IconName.attachment}
        placeholder="Bot URL"
        className="w-full"
      />
      <Input
        type="text"
        value={config.accessToken}
        onChange={handleTokenChange}
        onFocus={handleFocus}
        icon={IconName.attachment}
        ref={inputWithTokeRef}
        placeholder="Access Token"
        className="w-full"
      />
      {withBotReset && canResetBot ? (
        <label
          htmlFor="resetState"
          className="flex items-center self-start mb-5 gap-[0.31rem] text-black"
        >
          <Checkbox
            id="resetState"
            className="rounded-[0.25rem] data-[state=checked]:text-white"
            checked={resetEnabled}
            onCheckedChange={handleCheckboxChange}
            disabled={!canResetBot}
          />
          Refresh chat window
        </label>
      ) : null}
      {!children ? (
        <Button
          type="submit"
          disabled={!config.baseURL.trim() || !config.accessToken.trim()}
          className="bg-blue-700 hover:bg-blue-700/75 text-white text-base  font-semibold w-60 py-3 px-6"
        >
          Open Bot
        </Button>
      ) : (
        children
      )}
    </form>
  );
}
