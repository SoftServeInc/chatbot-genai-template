import { Button } from '../../../../lib';
import { Icon, IconName } from '../../../../components';

type Props = {
  onAddMore?: () => void;
};

export function UploadProcessing({ onAddMore }: Props) {
  return (
    <div className="flex-col">
      <div className="flex flex-col items-center mb-10 pt-6">
        <Icon name={IconName.checkCircle} className="w-[4rem] h-[4rem] mb-4 mr-4" />
        <figcaption className="text-center font-normal text-sm text-black w-[12.5rem]">
          Your data was taken for processing. Do you want give me more data to learn?
        </figcaption>
      </div>
      <div className="text-center">
        <Button
          type="button"
          className="text-black rounded px-10 border border-[#0C72D6] bg-white font-semibold text-sm hover:text-white transition"
          onClick={onAddMore}
        >
          Add More Data
        </Button>
      </div>
    </div>
  );
}
