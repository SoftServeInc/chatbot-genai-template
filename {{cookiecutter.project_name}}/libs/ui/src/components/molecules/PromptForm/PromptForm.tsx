import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { cn } from '../../../lib/utils';
import { Button } from '../../../lib/shadcn.ui';
import { useEnterSubmit } from '../../../hooks/useEnterSubmit';
import { Icon, IconName } from '../..';

interface ChatInputProps {
  multiline?: boolean;
  className?: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  value: string;
  disabled?: boolean;
}
function ChatInput({ multiline = false, onChange, onKeyDown, ...props }: ChatInputProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return multiline ? (
    <TextareaAutosize
      {...props}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onChange={handleChange}
      rows={1}
      maxRows={7}
      spellCheck={false}
      autoFocus
    />
  ) : (
    <input type="text" onChange={handleChange} {...props} />
  );
}

interface PromptFormProps {
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  realtime?: boolean;
  onSubmit?: (prompt: string) => void;
  onStopStreming?: () => void;
}
export function PromptForm({
  placeholder = 'Type your message',
  onSubmit,
  onStopStreming,
  disabled,
  multiline,
  realtime = false,
}: PromptFormProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const [prompt, setMessage] = useState<string>('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (prompt.trim()) {
      if (onSubmit) {
        onSubmit(prompt);
      }

      setMessage('');
    }
  };

  return (
    <form
      ref={formRef}
      className={cn(
        '@xs/chat:p-2 @xs/chat:pl-4 @xs/chat:gap-1.5 @xs/chat:rounded-2xl',
        '@2xl/chat:min-h-[4.25rem] @2xl/chat:gap-3 @2xl/chat:pl-[1.5625rem] @2xl/chat:py-3 @2xl/chat:pr-3 @2xl/chat:rounded-[1.25rem]',
        'flex items-center shadow-container mx-auto bg-white',
      )}
      onSubmit={handleSubmit}
    >
      <ChatInput
        className={cn(
          '@xs/chat:text-sm/5 @xs/chat:tracking-tightest',
          'w-full dark:text-black placeholder:text-muted-foreground resize-none focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'text-[0.9375rem]/6',
        )}
        onChange={setMessage}
        onKeyDown={onKeyDown}
        value={prompt}
        placeholder={placeholder}
        multiline={multiline}
        disabled={disabled}
      />
      <div
        className={cn(
          '@xs/chat:h-[2.375rem]',
          '@2xl/chat:h-11',
          'flex items-center self-end gap-2',
        )}
      >
        {!realtime ? (
          <Button
            type="submit"
            size="icon"
            disabled={!prompt.trim() || disabled}
            className={cn('bg-blue-700', '@xs/chat:w-[2.375rem]', '@2xl/chat:w-11', 'h-full')}
          >
            <Icon name={IconName.send} fill="#fff" className="h-6 w-6" />
          </Button>
        ) : (
          <Button
            onClick={onStopStreming}
            variant="outline"
            className="h-full justify-between items-center bg-white border-blue-700 self-stretch flex gap-2 px-4 py-1.5 rounded-md border-2 border-solid"
          >
            <Icon name={IconName.stop} className="h-6 w-6" />
            <span className="text-zinc-900 text-sm font-semibold leading-6 tracking-normal grow whitespace-nowrap">
              Stop generating
            </span>
          </Button>
        )}
      </div>
    </form>
  );
}
