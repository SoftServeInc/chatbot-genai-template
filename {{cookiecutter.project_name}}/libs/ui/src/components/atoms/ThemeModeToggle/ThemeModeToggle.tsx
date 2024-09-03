import { Moon, Sun } from 'lucide-react';

import { Button } from '../../../lib/shadcn.ui';
import { cn } from '../../../lib/utils';
import { useTheme } from '../../../hooks/useTheme';

export function ThemeModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className={cn('@xs/main-sidebar:flex-row', 'flex flex-col gap-[0.62rem] my-5 px-2')}>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'bg-transparent border-2 border-[#141718]/[0.2]',
          'dark:bg-[#D9D9D9]/[0.2] dark:border-transparent hover:bg-[#D9D9D9]/[0.2]',
          'w-[2.625rem] h-[2.625rem] rounded-full transition-colors',
        )}
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-6 w-6 stroke-[#141718]/[0.2] dark:stroke-white" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'dark:bg-transparent dark:border-2 dark:border-[#D9D9D9]/[0.2]',
          'bg-[#141718]/[0.1] border-transparent',
          'w-[2.625rem] h-[2.625rem] rounded-full transition-colors hover:bg-[#141718]/[0.1]',
        )}
        onClick={() => setTheme('light')}
      >
        <Sun className="h-6 w-6 dark:stroke-[#D9D9D9]/[0.2]" />
      </Button>
    </div>
  );
}
