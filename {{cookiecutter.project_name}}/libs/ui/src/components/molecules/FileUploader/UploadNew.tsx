import { InputHTMLAttributes } from 'react';
import { Icon, IconName } from '../..';

type Format = {
  applicable: string;
  types: string[];
  extensions: string[];
};

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  format: Format;
}

export function UploadNew({ format, ...inputProps }: Props) {
  return (
    <div className="flex flex-col items-center font-normal text-sm text-black ">
      <Icon name={IconName.export} className="w-10 h-10 mb-2" />
      <figcaption>
        <p className="mb-2 text-center">
          Drag & Drop or <span className="font-semibold underline">Choose file</span> to upload
        </p>
        <p className="text-center text uppercase opacity-50">
          {format.extensions.join(', ').replace('.', '')}
        </p>
      </figcaption>
      <input
        className="absolute w-full h-full cursor-pointer opacity-0"
        type="file"
        name="File Uploader"
        accept={format.types.join(', ')}
        {...inputProps}
      />
    </div>
  );
}
