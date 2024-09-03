import { ChangeEvent, useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from '../../../lib/shadcn.ui';
import { cn } from '../../../lib/utils';
import { Icon, IconName, FilterChip } from '../..';
import { FilterChipType } from '../../atoms/Chip/FilterChip/enums';

interface FeedbackProps {
  rating?: number;
  quickOptions?: string[];
  onSubmit?: (comment: string, activeQuickOptions: string[]) => void;
}

export function Feedback({ quickOptions, onSubmit, rating }: FeedbackProps) {
  const wrapperClasses = `@xs/chat:py-2 @xs/chat:px-[0.87rem] @xs/chat:text-sm @xs/chat:tracking-tightest',
  '@2xl/chat:py-3 @2xl/chat:px-[1.19rem] @2xl/chat:text-[0.9375rem]/6 @2xl/chat:tracking-normal',
  'min-h-[3rem] min-w-[24rem] max-w-[46.25rem] mb-[0.31rem] rounded-xl p-4 bg-white shadow-chat-message dark: mt-2`;
  const [comment, setComment] = useState('');
  const [activeQuickOptions, setActiveQuickOptions] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setVisible(true);
    setSubmitted(false);
  }, [rating]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };
  const onChipClick = (chip: string) => {
    const index = activeQuickOptions.findIndex((c) => c === chip);
    if (index > -1) {
      setActiveQuickOptions(activeQuickOptions.filter((c) => c !== chip));
    } else {
      setActiveQuickOptions([...activeQuickOptions, chip]);
    }
  };
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(comment, activeQuickOptions);
    }
    setSubmitted(true);
  };

  if (!visible) {
    return null;
  }

  if (submitted) {
    return (
      <div className={cn(wrapperClasses, 'max-w-[22rem] min-w-[20rem] pt-2 pb-2')}>
        <div className="flex justify-between ">
          <h3 className="text-black lex font-semibold text-lg leading-10 mr-10">
            Thank you for feedback!
          </h3>
          <Button size="icon" variant="ghost" onClick={() => setVisible(false)}>
            <Icon name={IconName.close} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      <div className="flex justify-between">
        <h3 className="text-black lex text-md leading-10 font-semibold">Describe your rate</h3>
        <Button
          size="icon"
          variant="ghost"
          data-testid="close-feedback"
          onClick={() => setVisible(false)}
        >
          <Icon name={IconName.close} />
        </Button>
      </div>
      <div className="flex justify-start mt-4 mb-4">
        {quickOptions?.map((c) => (
          <FilterChip
            key={c}
            text={c}
            type={FilterChipType.outline}
            isActive={!!activeQuickOptions.find((a) => a === c)}
            onClick={onChipClick}
          />
        ))}
      </div>
      <div className="mt-4 mb-4">
        <TextareaAutosize
          className="w-full dark:text-black placeholder:text-blue-grey-600 resize-none focus-visible:outline-none p-4 border-2 border-blue-gray-75 rounded-md text-sm"
          tabIndex={0}
          onChange={handleChange}
          value={comment}
          rows={1}
          maxRows={4}
          spellCheck={false}
          autoFocus
          placeholder="Provide additional feedback"
          data-testid="feedback-textarea"
        />
      </div>
      <div className="text-left">
        <Button
          type="submit"
          className="text-white rounded px-10 font-semibold text-sm"
          onClick={handleSubmit}
          disabled={!comment && activeQuickOptions.length === 0}
          data-testid="submit-feedback"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
