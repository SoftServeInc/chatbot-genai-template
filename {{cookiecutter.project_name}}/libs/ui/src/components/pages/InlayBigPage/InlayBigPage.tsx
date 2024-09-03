import { useState } from 'react';
import { Button } from '../../../lib/shadcn.ui/button';
import { PageLayout } from '../../templates';
import { Assistant, KnowledgeBase } from '../../../features';

export function InlayBigPage() {
  const [visible, setVisible] = useState(false);

  const handleKnowledgeBase = () => {
    setVisible(!visible);
  };

  return (
    <PageLayout className="w-full">
      <header className="p-3 border-b bg-white px-10 py-4 rounded-t-xl flex flex-row justify-between">
        <h5 className="text-2xl/10 font-semibold tracking-[-.045em] text-black">
          ChatBot Big Inlay
        </h5>
        <Button variant="outline" onClick={handleKnowledgeBase}>
          Knowledge Base
        </Button>
      </header>
      <KnowledgeBase modal={{ isVisible: visible, handleKnowledgeBase }} />
      <Assistant
        header={{
          title: '',
        }}
        styles={{
          header: 'hidden',
        }}
      />
    </PageLayout>
  );
}
