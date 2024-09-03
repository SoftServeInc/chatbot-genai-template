import { Button } from '../../../../lib';
import { Icon, IconName } from '../../../../components';

type Props = {
  hidden: boolean;
  goingToRemove: boolean;
  onClick: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function RemovalConfirmation({
  hidden,
  goingToRemove,
  onClick,
  onConfirm,
  onCancel,
}: Props) {
  if (hidden) {
    return null;
  }

  return (
    <>
      {goingToRemove ? (
        <p className="pr-2 flex-grow font-normal text-sm">Do you want delete this item?</p>
      ) : null}
      <div>
        {goingToRemove ? (
          <div>
            <Button
              onClick={onConfirm}
              className="mr-2 text-white rounded-sm px-2 py-1 leading-none h-auto min-w-[40px]"
            >
              Yes
            </Button>
            <Button
              className="bg-white rounded-sm rounded-sm px-2 py-1 leading-none h-auto hover:bg-white min-w-[40px]"
              onClick={onCancel}
            >
              No
            </Button>
          </div>
        ) : (
          <button type="button" aria-label="delete" onClick={onClick} className="cursor-pointer">
            <Icon name={IconName.delete} />
          </button>
        )}
      </div>
    </>
  );
}
