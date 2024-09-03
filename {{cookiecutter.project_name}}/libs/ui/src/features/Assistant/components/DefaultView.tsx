import { Answer, Question, PromptForm } from '../../../components/molecules';
import { Chat, ChatFooter, Conversation } from '../../../components/organisms';
import { MessageAuthor, MessageRating } from '../../../types';
import { AssistantProps } from '../Assistant';

export function Default({ header, chat, styles, actions }: AssistantProps) {
  return (
    <Chat
      id={chat?.id || ''}
      header={{
        title: header?.title || '',
        className: styles?.header,
      }}
      rounded={chat?.rounded}
      actions={header?.actions}
      className={`w-full ${styles?.chat || ''}`}
    >
      <Conversation
        isLoading={chat?.isLoading}
        capabilities={chat?.capabilities || []}
        onCapabilityClick={actions?.onSubmit}
        className="max-w-[75rem] mx-auto w-full"
      >
        {Boolean(chat?.messages?.length) &&
          chat?.messages.map(({ id, created_at, segments, role, feedback_rating }) => {
            if (role === MessageAuthor.user) {
              return (
                <Question key={id} time={created_at} avatar={chat.icons?.user}>
                  {segments[0].content}
                </Question>
              );
            }
            return (
              <Answer
                key={id}
                realtime={chat.activeMessageId === id}
                type={segments[0].type}
                rating={{
                  data: {
                    like: feedback_rating && feedback_rating > 0 ? feedback_rating : 0,
                    dislike: feedback_rating && feedback_rating < 0 ? feedback_rating : 0,
                  },
                  // showCount: true,
                  onChange: (rating) => {
                    const feedback = {
                      rating: Object.values(rating).find((value) => value > 0 || value < 0) || 0,
                      comment: '',
                    };
                    actions?.onAddFeedback(feedback, id);
                  },
                }}
                feedback={{
                  visible: !!feedback_rating && feedback_rating !== 0,
                  rating: feedback_rating,
                  quickOptions:
                    feedback_rating && feedback_rating > 0
                      ? ['Right', 'Simple', 'Finished']
                      : ['Not Relevant', 'Danger', 'Other'],
                  onSubmit: (comment: string, quickOptions: string[]) => {
                    const feedback = {
                      rating: feedback_rating,
                      comment,
                      quickOptions,
                    } as MessageRating;
                    actions?.onAddFeedback(feedback, id);
                  },
                }}
              >
                {segments[0].content}
              </Answer>
            );
          })}
      </Conversation>
      <ChatFooter className="px-[6.44rem] max-w-[75rem] mx-auto w-full">
        <PromptForm
          multiline
          disabled={chat?.isLoading}
          realtime={Boolean(chat?.activeMessageId?.length)}
          onStopStreming={actions?.onStopStreaming}
          onSubmit={actions?.onSubmit}
        />
      </ChatFooter>
    </Chat>
  );
}
