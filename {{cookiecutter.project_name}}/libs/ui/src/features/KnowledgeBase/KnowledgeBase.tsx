import { createPortal } from 'react-dom';
import { Button } from '../../lib';
import { Frame } from './components';
import { Icon, IconName } from '../../components';
import { FULLSCREEN_ROOT } from '../../constants';

type Props = {
  modal?: {
    isVisible: boolean;
    handleKnowledgeBase: () => void;
  };
};

export function KnowledgeBase({ modal }: Props) {
  return (
    <>
      {modal &&
        modal.isVisible &&
        createPortal(
          <div className="animate-appear-from-bottom flex backdrop-blur bg-[rgba(197,204,214,0.75)] dark:bg-[rgba(13,42,86,0.75)] fixed top-0 inset-x-0 pt-[3.75rem] bottom-0 shadow-[0_-11px_32px_0_rgba(48,55,70,0.17)]">
            <div className="rounded-t-xl bg-white overflow-clip flex flex-1 flex-col">
              <div className="flex justify-between items-center border-b py-3 px-6">
                <span className="text-xl font-semibold text-black">KnowledgeBase</span>
                <Button size="icon" variant="ghost" onClick={modal.handleKnowledgeBase}>
                  <Icon name={IconName.close} className="text-black" />
                </Button>
              </div>
              <Frame />
            </div>
          </div>,
          document.getElementsByClassName(FULLSCREEN_ROOT)[0] || document.body,
        )}
      {!modal && <Frame />}
    </>
  );
}
