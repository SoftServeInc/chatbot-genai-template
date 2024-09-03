export enum FileStatuses {
  created = 'created',
  uploading = 'uploading',
  pending = 'pending',
  inprogress = 'inprogress',
  completed = 'completed',
  deleting = 'deleting',
  deleted = 'deleted',
  failed = 'failed',
}

export type FileInfo = {
  name: string;
  type?: string;
  data: File | null;
};

export interface UploadedFile {
  id: string;
  name: string;
  status: FileStatuses;
  date: string;
  size: number;
}

export interface UploadFileResponse extends UploadedFile {
  url: string;
  expiry: string;
  created_at?: string;
}

export type GetUploadedFilesResponse = UploadedFile;

type UploadStatus = {
  progress: number;
  info: string;
};

export type UploadProgress = { [id: string]: UploadStatus };
