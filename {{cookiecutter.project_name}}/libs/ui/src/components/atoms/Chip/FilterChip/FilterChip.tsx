import { cn } from '../../../../lib/utils';
import { Icon, IconName } from '../../..';
import { FilterChipSize, FilterChipType } from './enums';

export interface ChipProps {
  text: string;
  isActive: boolean;
  disabled?: boolean;
  size?: FilterChipSize;
  type?: FilterChipType;
  onClick?: (c: string) => void;
}

function FilterChip({
  text,
  isActive,
  disabled = false,
  size = FilterChipSize.sm,
  type = FilterChipType.default,
  onClick,
}: ChipProps) {
  const disabledStyle = 'cursor-not-allowed opacity-50 hover:bg-bg-inherit';
  const sizes: { [key: number]: string } = {
    [FilterChipSize.sm]: 'pr-[10px] pl-[10px] pt-[1px] pb-[1px] rounded-3xl mr-2',
    [FilterChipSize.lg]: 'pr-[21px] pl-[21px] pt-[11px] pb-[11px] rounded-[38px] mr-2',
  };

  const types: { [key: string]: string } = {
    [FilterChipType.default]:
      'border border-blue-50 text-blue-800 cursor-pointer bg-blue-50 hover:bg-blue-100 hover:text-blue-900',
    [FilterChipType.destructive]:
      'border border-blue-gray-50 text-black cursor-pointer bg-blue-gray-50 hover:bg-blue-gray-100',
    [FilterChipType.outline]:
      'border border-blue-700 text-blue-800 cursor-pointer hover:bg-blue-50',
    [FilterChipType.secondary]:
      'border border-blue-gray-100 text-black cursor-pointer hover:bg-blue-gray-100',
  };

  const activeTypes: { [key: string]: string } = {
    [FilterChipType.default]: 'border border-blue-700 text-white cursor-pointer bg-blue-700',
    [FilterChipType.destructive]:
      'border border-blue-gray-600 text-white cursor-pointer bg-blue-gray-600',
    [FilterChipType.outline]: 'border border-blue-700 text-blue-900 cursor-pointer bg-blue-100',
    [FilterChipType.secondary]:
      'border border-blue-gray-400 bg-blue-gray-100 text-black cursor-pointer',
  };

  const iconColors: { [key: string]: string } = {
    [FilterChipType.default]: '#FFFFFF',
    [FilterChipType.destructive]: '#FFFFFF',
    [FilterChipType.outline]: '#0846A6',
    [FilterChipType.secondary]: '#191A1D',
  };

  return (
    <button type="button" onClick={() => !disabled && onClick && onClick(text)}>
      {isActive ? (
        <div
          className={cn(
            activeTypes[type],
            sizes[size],
            'flex items-center',
            `${disabled ? disabledStyle : ''}`,
          )}
          data-testid="active-chip"
        >
          <Icon fill={iconColors[type]} className="mr-2" size={20} name={IconName.check} /> {text}
        </div>
      ) : (
        <div className={cn(types[type], sizes[size], `${disabled ? disabledStyle : ''}`)}>
          {text}
        </div>
      )}
    </button>
  );
}

FilterChip.displayName = 'FilterChip';

export { FilterChip };
