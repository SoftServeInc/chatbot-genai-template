import { useState } from 'react';
import { UploadMore } from './UploadMore';
import { UploadProcessing } from './UploadProcessing';

export function UploadData() {
  const [uploaded, setUploaded] = useState<boolean>(false);

  return (
    <div>
      {uploaded ? (
        <UploadProcessing onAddMore={() => setUploaded(false)} />
      ) : (
        <UploadMore onAfterUpload={() => setUploaded(true)} />
      )}
    </div>
  );
}
