import { UseKnowledgeBaseStore } from './useKnowledgeBaseStore';

export const useSelectKnowledgeBaseStatus = () => UseKnowledgeBaseStore((state) => state.status);
export const useSelectIsDataProcessing = () => UseKnowledgeBaseStore((state) => state.isLoading);
export const useSelectUploadedFiles = () => UseKnowledgeBaseStore((state) => state.files);
export const useSelectFetchUploadedFiles = () =>
  UseKnowledgeBaseStore((state) => state.fetchUploadedFiles);
export const useSelectCreateNewFile = () => UseKnowledgeBaseStore((state) => state.createNewFile);
export const useSelectUploadNewFile = () => UseKnowledgeBaseStore((state) => state.uploadNewFile);
export const useSelectUpdateFileName = () => UseKnowledgeBaseStore((state) => state.updateFileName);
export const useSelectRemoveFile = () => UseKnowledgeBaseStore((state) => state.removeFile);
export const useSelectFileUploadProgress = () =>
  UseKnowledgeBaseStore((state) => state.uploadProgress);
