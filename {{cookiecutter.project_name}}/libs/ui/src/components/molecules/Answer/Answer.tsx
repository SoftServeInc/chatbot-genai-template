import { ReactNode } from 'react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { Avatar, AvatarIconType, Timestamp, Replying, Markdown, Icon, IconName } from '../../atoms';
import { MessageCard, Rating, Feedback } from '..';
import { MessageType } from '../../../types';
import styles from './styles.module.scss';

interface AnswerRating {
  data:
    | {
        like: number;
        dislike: number;
      }
    | undefined;
  onChange?: (votes: { like: number; dislike: number }) => void;
  showCount?: boolean;
}

interface FeedbackProp {
  visible: boolean;
  rating?: number;
  quickOptions?: string[];
  onSubmit?: (comment: string, activeQuickOptions: string[]) => void;
}

const Content = new Map();
function ContentWithText({
  children,
  rating,
  feedback,
  realtime = false,
}: {
  children: ReactNode | string;
  rating?: AnswerRating | null;
  feedback?: FeedbackProp | null;
  realtime?: boolean;
}) {
  let content = typeof children === 'string' ? children : null;

  if (content) {
    // Replace a single line break "\n" with "<space><space>\n" so that the markdown parser recognizes it as a line break.
    // Otherwise, the markdown parser will not render a line break, but will render a space instead.
    // On the other hand, if there are two or more line breaks, the markdown parser will render a new paragraph.
    content = content.replace(/(?<!\n)\n(?!\n)/g, '  \n');
  }

  return (
    <>
      <MessageCard.Content className="bg-white shadow-chat-message dark:">
        {realtime && <Replying className="mb-2" />}
        <Markdown className={styles.textCard} remarkPlugins={[remarkGfm, remarkMath]}>
          {content}
        </Markdown>
      </MessageCard.Content>
      <Rating {...rating} />
      {feedback?.visible ? <Feedback {...feedback} /> : null}
    </>
  );
}
Content.set(MessageType.text, ContentWithText);

function ContentWithError({ children }: { children: ReactNode | ReactNode[] }) {
  return (
    <MessageCard.Content className="flex bg-destructive text-destructive-foreground">
      <Icon name={IconName.errorOutline} fill="#B71C1C" />
      {children}
    </MessageCard.Content>
  );
}
Content.set(MessageType.error, ContentWithError);

function ContentWithLoader() {
  return (
    <MessageCard.Content className="bg-white shadow-chat-message">
      <Replying />
    </MessageCard.Content>
  );
}
Content.set(MessageType.responds, ContentWithLoader);

interface AnswerProps {
  time?: string;
  avatar?: string;
  children?: ReactNode | ReactNode[];
  type?: MessageType;
  rating?: AnswerRating | null;
  feedback?: FeedbackProp | null;
  realtime?: boolean;
}

export function Answer({
  type = MessageType.text,
  time,
  avatar,
  rating = null,
  feedback = null,
  children,
  realtime = false,
}: AnswerProps) {
  const MessageContent = Content.get(type);

  return (
    <MessageCard type={type}>
      <Avatar
        size={55}
        src={avatar}
        type={avatar ? AvatarIconType.img : AvatarIconType.icon}
        className="@xs/chat:hidden @2xl/chat:block mr-4"
      />
      <MessageCard.Body>
        <Timestamp>{time}</Timestamp>
        <MessageContent rating={rating} realtime={realtime} feedback={feedback}>
          {children}
        </MessageContent>
      </MessageCard.Body>
    </MessageCard>
  );
}
