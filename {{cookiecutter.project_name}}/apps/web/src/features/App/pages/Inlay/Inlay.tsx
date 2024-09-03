import { KnowledgeBase, PageLayout } from 'ui';
import { useState } from 'react';
import { Chatbot } from '@/components/organisms';

export function InlayPage() {
  const [visible, setVisible] = useState(false);

  const handleKnowledgeBase = () => {
    setVisible(!visible);
  };

  return (
    <PageLayout title="ChatBot Big Inlay">
      <KnowledgeBase modal={{ isVisible: visible, handleKnowledgeBase }} />
      <Chatbot header={{ className: 'hidden' }} />
    </PageLayout>
  );
}
