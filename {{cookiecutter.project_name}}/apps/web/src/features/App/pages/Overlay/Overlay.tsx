import { ContentWireframe, PageLayout } from 'ui';
import { Chatbot } from '@/components/organisms';

export function OverlayPage() {
  return (
    <PageLayout title="Chatbot Big Overlay" enableFullScreen>
      <ContentWireframe />
      <Chatbot
        variant="popup"
        withChats
        header={{
          className: 'py-[0.94rem] px-5 text-xl/8 font-semibold',
        }}
        fabButton={{
          className: 'absolute end-10 bottom-10',
        }}
      />
    </PageLayout>
  );
}
