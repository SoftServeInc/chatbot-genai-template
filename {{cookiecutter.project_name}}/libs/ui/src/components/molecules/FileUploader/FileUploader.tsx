import React, { useState, DragEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadNew } from './UploadNew';
import { FilesPreview } from './FilesPreview';

import styles from './styles.module.scss';

type Props = {
  onChange?: (file: File[]) => void;
  onRemove?: () => void;
};

export function FileUploader({ onChange, onRemove }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isActive, setIsActive] = useState(false);
  const format = {
    applicable: 'documents',
    // types: ["txt", "pdf", "csv"],
    types: ['application/pdf'],
    extensions: ['.pdf'],
  };

  const handleFiles = (files: FileList) => {
    if (files.length) {
      const fileArray = Array.from(files);

      const isFilesTypeValid = fileArray.every((file) => format.types.indexOf(file.type) >= 0);

      if (isFilesTypeValid) {
        setSelectedFiles(fileArray);
        if (onChange) onChange(fileArray);
      }
    }
  };

  const handleDrop = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { files } = event.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      handleFiles(files);
    }
    setIsActive(false);
  };

  const handleDragOver = (event: DragEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    setSelectedFiles([]);
    if (onRemove) onRemove();
  };

  return (
    <div
      className={`${styles.fileInput} ${isActive ? 'active' : ''} ${
        selectedFiles.length ? styles.fileSelected : ''
      } flex flex-col rounded-md p-6 items-center relative`}
    >
      <AnimatePresence>
        {!selectedFiles.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UploadNew
              format={format}
              onChange={handleFileInputChange}
              onDragEnter={() => setIsActive(true)}
              onDragOver={handleDragOver}
              onFocus={() => setIsActive(true)}
              onClick={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
              onDrop={handleDrop}
              onDragLeave={() => setIsActive(false)}
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FilesPreview onRemove={handleRemove} data={selectedFiles} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
