import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Form } from 'react-router-dom';
import { FileStatuses } from '../../../../types';
import { FileUploader } from '../../../../components/molecules';
import { Button } from '../../../../lib';
import { Input } from '../../../../components';

import {
  useSelectCreateNewFile,
  useSelectKnowledgeBaseStatus,
} from '../../store/useKnowledgeBaseStoreSelectors';

type FileInfo = {
  name: string;
  data: File | null;
};

type Props = {
  onAfterUpload: () => void;
};

export function UploadMore({ onAfterUpload }: Props) {
  const knowledgeBaseStatus = useSelectKnowledgeBaseStatus();
  const createNewFile = useSelectCreateNewFile();
  const [fileInfo, setFileInfo] = useState<FileInfo>({ name: '', data: null });

  useEffect(() => {
    if (knowledgeBaseStatus === FileStatuses.created) {
      onAfterUpload();
    }
  }, [knowledgeBaseStatus, onAfterUpload]);

  const handleFileUpload = (file: File[]) => {
    setFileInfo({ name: file[0].name, data: file[0] });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await createNewFile(fileInfo);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFileInfo((prev) => ({ ...prev, name: value }));
  };

  const handleRemove = () => {
    setFileInfo({ name: '', data: null });
  };

  return (
    <div className="flex-col">
      <p className="mb-6 font-normal text-sm text-black">Give me some data to learn from.</p>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Knowledge Item Title"
          className="w-full"
          disabled={!fileInfo.data}
          value={fileInfo.name}
          onChange={handleNameChange}
        />

        <div className="mb-5 mt-5">
          <FileUploader onChange={handleFileUpload} onRemove={handleRemove} />
        </div>

        <div className="text-center">
          <Button
            type="submit"
            className="text-white rounded px-10 font-semibold text-sm"
            disabled={!fileInfo.data}
          >
            Upload
          </Button>
        </div>
      </Form>
    </div>
  );
}
