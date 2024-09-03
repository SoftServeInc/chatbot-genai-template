import { useState } from 'react';
import { filesize } from 'filesize';
import { motion, usePresence } from 'framer-motion';
import {
  FileStatuses,
  UploadedFile as UploadedFileType,
  UploadProgress,
} from '../../../../types/FileTypes';
import { RemovalConfirmation } from './RemovalConfirmation';
import { Icon, IconName } from '../../../../components';

interface Props extends UploadedFileType {
  uploadStatus: UploadProgress;
  onRemove: (id: string) => void;
}

const mapToText = (status: FileStatuses) => {
  if (status === FileStatuses.inprogress) {
    return 'In progress';
  }
  return status;
};

export function UploadedFile({ id, name, status, size, uploadStatus, onRemove }: Props) {
  const [isPresent, safeToRemove] = usePresence();
  const [removing, setRemoving] = useState<boolean>(false);

  const handleRemove = () => {
    setRemoving(true);
  };

  const confirmRemoving = () => {
    setRemoving(false);
    onRemove(id);
  };

  const cancelRemoving = () => {
    setRemoving(false);
  };

  const animation = {
    layout: true,
    initial: 'out',
    animate: isPresent ? 'in' : 'out',
    variants: {
      in: { y: 0, opacity: 1 },
      out: { y: 50, opacity: 0 },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition: { type: 'spring', stiffness: 500, damping: 50, mass: 1 },
  };

  return (
    <motion.li
      {...animation}
      className="relative flex flex-row items-center justify-stretch w-full mb-3 border rounded-md px-3 py-1 overflow-hidden min-h-[3rem]"
    >
      <div
        className={`fill absolute top-0 left-0 h-full ${status} transition bg-[#0C71D6]/10`}
        style={{
          width: `${uploadStatus[id] ? uploadStatus[id].progress : 100}%`,
        }}
      />
      <div className="flex flex-row w-full relative items-center text-black">
        <Icon name={IconName.pdf} className="w-[1.6rem] h-[1.6rem] mr-3 min-w-[1.6rem]" />
        {!removing ? (
          <div className="flex-col flex-grow pr-2">
            <div className="font-normal text-sm break-all">{name}</div>
            <div className="font-normal text-sm opacity-50">
              {status ? <span className="capitalize">{mapToText(status)} • </span> : null}
              {status === FileStatuses.deleting && 'Removing knowledge item ...'}
              {status === FileStatuses.completed && filesize(size)}
              {status === (FileStatuses.pending || FileStatuses.uploading) &&
                uploadStatus[id] &&
                uploadStatus[id].info}
              {(status === FileStatuses.pending || status === FileStatuses.inprogress) &&
                !uploadStatus[id] &&
                'Knowledge generation ...'}
            </div>
          </div>
        ) : null}
        <RemovalConfirmation
          hidden={status === FileStatuses.deleting}
          goingToRemove={removing}
          onClick={handleRemove}
          onConfirm={confirmRemoving}
          onCancel={cancelRemoving}
        />
      </div>
    </motion.li>
  );
}
