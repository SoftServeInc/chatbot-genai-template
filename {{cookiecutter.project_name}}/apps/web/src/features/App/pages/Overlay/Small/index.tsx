import { ContentWireframe, PageLayout } from 'ui';
import { Chatbot } from '@/components/organisms';

export function OverlaySmallPage() {
  return (
    <PageLayout title="Chatbot Small Overlay" enableFullScreen>
      <ContentWireframe />
      <Chatbot
        variant="sidebar"
        header={{
          title: 'Chatbot Assistant',
          className: 'pl-[0.94rem] pr-3 px-3 text-xl/8 font-semibold',
        }}
        fabButton={{
          className: 'absolute end-10 bottom-10',
        }}
      />
    </PageLayout>
  );
}
