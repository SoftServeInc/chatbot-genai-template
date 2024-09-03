import { FileInfo, UploadFileResponse, GetUploadedFilesResponse } from '../../../types';
import { CustomHeaders } from '../../../api/custom-headers';
import { api, ProgressEvent, RequestConfig } from '../../../api/client/index';

export const getUploadedFiles = async (): Promise<GetUploadedFilesResponse[]> => {
  const url = '/documents';
  const response = await api.get(url);
  return response.data.data;
};

export const createFile = async (file: FileInfo): Promise<UploadFileResponse> => {
  const url = '/documents';
  const body = { data: { name: file.name, content_type: file ? file?.data?.type : '' } };
  const response = await api.post(url, body);
  return response.data.data;
};

export const uploadFile = async (
  file: File | null,
  presignedURL: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) => {
  if (file) {
    const requestConfig: RequestConfig = {
      headers: {
        'Content-Type': file.type,
        [CustomHeaders.OmitAuthToken]: true,
      },
      onUploadProgress,
    };
    await api.put(presignedURL, file, requestConfig);
  }
};

export const updateFile = async (id: string, name: string): Promise<UploadFileResponse> => {
  const url = `/documents/${id}`;
  const body = { name };

  const response = await api.post(url, body);
  return response.data.data;
};

export const removeFile = async (id: string): Promise<void> => {
  const url = `/documents/${id}`;
  await api.delete(url);
};
