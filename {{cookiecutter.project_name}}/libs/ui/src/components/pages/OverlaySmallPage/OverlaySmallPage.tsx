import { ContentWireframe, PageLayout } from '../../templates';
import { Assistant } from '../../../features';

export function OverlaySmallPage() {
  return (
    <PageLayout title="Chatbot Small Overlay">
      <ContentWireframe />
      <Assistant
        variant="sidebar"
        header={{
          title: 'Chatbot Assistant',
        }}
        styles={{
          header: 'pl-[0.94rem] pr-3 px-3 text-xl/8 font-semibold',
          fabButton: 'absolute end-10 bottom-10',
        }}
      />
    </PageLayout>
  );
}
