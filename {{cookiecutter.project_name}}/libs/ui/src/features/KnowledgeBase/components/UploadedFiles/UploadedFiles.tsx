import { useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileStatuses } from '../../../../types';

import {
  useSelectUploadedFiles,
  useSelectKnowledgeBaseStatus,
  useSelectFetchUploadedFiles,
  useSelectRemoveFile,
  useSelectFileUploadProgress,
} from '../../store/useKnowledgeBaseStoreSelectors';
import { UploadedFile } from '../UploadedFile/UploadedFile';
import { Icon, IconName } from '../../../../components';

export function UploadedFiles() {
  const files = useSelectUploadedFiles();
  const knowledgeBaseStatus = useSelectKnowledgeBaseStatus();
  const fetchFiles = useSelectFetchUploadedFiles();
  const removeFile = useSelectRemoveFile();
  const uploadStatus = useSelectFileUploadProgress();

  useEffect(() => {
    const interval = setInterval(() => fetchFiles(), 15000);

    fetchFiles();

    return () => {
      clearInterval(interval);
    };
  }, [fetchFiles]);

  const inprogress = useMemo(
    () =>
      files.some(
        ({ status }) => status === FileStatuses.inprogress || status === FileStatuses.pending,
      ),
    [files],
  );
  const failed = useMemo(() => files.some(({ status }) => status === FileStatuses.failed), [files]);

  return (
    <>
      <p
        className={`${knowledgeBaseStatus} font-normal text-sm text-black mt-10 flex items-center`}
      >
        <Icon name={IconName.bot} fill="#0C72D6" className="w-[3.5rem] h-[3.5rem] mr-4" />
        {!files.length && <span>You have no Knowledge items yet</span>}
        {inprogress && <span>I&apos;m generating some knowledge from your data ...</span>}
        {failed && <span>Oh...</span>}
        {!!files.length && !inprogress && !failed && <span>Currently I know such topics:</span>}
      </p>
      <ul className={`mt-5 ${knowledgeBaseStatus}`}>
        <AnimatePresence>
          {files.map((fileInfo) => (
            <UploadedFile
              {...fileInfo}
              uploadStatus={uploadStatus}
              onRemove={removeFile}
              key={fileInfo.id}
            />
          ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
