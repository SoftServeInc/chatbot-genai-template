import { ContentWireframe, PageLayout } from '../../templates';
import { Assistant, useChats, useConversation } from '../../../features';

export function OverlayBigPage() {
  const { chats, onCreate, onRemove, onRename, onFetchById } = useChats(true);
  const { id } = useConversation();

  return (
    <PageLayout title="Chatbot Big Overlay">
      <ContentWireframe />
      <Assistant
        variant="popup"
        styles={{
          header: 'py-[0.94rem] px-5 text-xl/8 font-semibold',
          fabButton: 'absolute end-10 bottom-10',
          chatsPanel: 'border-r',
        }}
        chatsPanel={{
          selected: id || '',
          chats,
          actions: {
            onSelect: onFetchById,
            onCreate,
            onRemove,
            onRename,
          },
        }}
      />
    </PageLayout>
  );
}
