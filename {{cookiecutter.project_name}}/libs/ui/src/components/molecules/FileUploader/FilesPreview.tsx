import { filesize } from 'filesize';
import { Icon, IconName } from '../..';

type File = {
  name: string;
  size: number;
};

type Props = {
  data: Array<File>;
  onRemove?: () => void;
};

export function FilesPreview({ data, onRemove }: Props) {
  return (
    <div className="flex flex-col items-center">
      <button aria-label="Button" type="button" onClick={onRemove} data-testid="remove-file">
        <Icon name={IconName.close} fill="#fff" className="w-5 h-5 absolute right-2 top-2" />
      </button>
      <Icon name={IconName.pdf} fill="#fff" className="w-10 h-10 mb-2" />
      {data.map(({ name, size }) => (
        <figcaption key={size} className="flex flex-col items-center font-normal text-white">
          <span className="mb-2">{name}</span>
          <span className="opacity-50">{filesize(size)}</span>
        </figcaption>
      ))}
    </div>
  );
}
