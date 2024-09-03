import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '../../../../lib';
import { BotExplorerConfigForm } from '../ConfigForm/ConfigForm';
import { BotExplorerConfigType } from '../../types/Config';

interface ConfiguratorProps {
  open: boolean;
  options: BotExplorerConfigType;
  onSubmit: (config: BotExplorerConfigType, resetEnabled: boolean) => void;
  onClose?: () => void;
}

export function BotExplorerConfigDialog({ open, options, onSubmit, onClose }: ConfiguratorProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="w-[41.875rem] p-0 gap-6 dark:bg-white">
        <DialogHeader className="px-[1.88rem] py-4 border-b">
          <DialogTitle className="text-2xl/10 font-bold dark:text-black">Configure Bot</DialogTitle>
        </DialogHeader>
        <BotExplorerConfigForm options={options} withBotReset onSubmit={onSubmit}>
          <footer className="pb-[1.87rem] flex gap-[0.625rem]">
            <Button className="w-[7.5rem] py-3 px-6 text-white" type="submit">
              Apply
            </Button>
            <Button
              className="w-[7.5rem] py-3 px-6 dark:bg-transparent dark:text-black"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </footer>
        </BotExplorerConfigForm>
      </DialogContent>
    </Dialog>
  );
}
