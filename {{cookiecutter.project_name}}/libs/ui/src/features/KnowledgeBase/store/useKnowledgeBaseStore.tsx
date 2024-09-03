import { create } from 'zustand';
import { filesize } from 'filesize';
import {
  createFile,
  getUploadedFiles,
  removeFile,
  updateFile,
  uploadFile,
} from '../api/knowledgeBase';
import { FileInfo, FileStatuses, UploadedFile, UploadProgress } from '../../../types/FileTypes';
import { ProgressEvent } from '../../../api/client/index';

type KnowledgeBaseState = {
  files: UploadedFile[];
  status: string;
  errors: string[];
  isLoading: boolean;
  uploadProgress: UploadProgress;
  fetchUploadedFiles: () => void;
  createNewFile: (file: FileInfo) => void;
  uploadNewFile: (
    file: File,
    url: string,
    onUploadProgress: (progressEvent: ProgressEvent) => void,
  ) => void;
  updateFileName: (id: string, name: string) => void;
  removeFile: (id: string) => void;
};

export const UseKnowledgeBaseStore = create<KnowledgeBaseState>((set) => ({
  files: [],
  status: 'empty',
  isLoading: false,
  errors: [],
  uploadProgress: {},
  fetchUploadedFiles: async () => {
    try {
      set({ status: 'loading', isLoading: true });
      const response = (await getUploadedFiles()) as UploadedFile[];

      set({
        files: response.filter(
          (file) => [FileStatuses.deleted, FileStatuses.deleting].indexOf(file.status) < 0,
        ),
        status: response.length ? 'default' : 'empty',
        isLoading: false,
      });
    } catch (error) {
      set({ status: 'empty', isLoading: false });
    }
  },
  createNewFile: async (file) => {
    try {
      set({ isLoading: true });
      const created = await createFile(file);
      set((state) => ({
        ...state,
        isLoading: false,
        status: 'created',
        files: [created, ...state.files],
        uploadProgress: {
          ...state.uploadProgress,
          [`${created.id}`]: {
            progress: 0,
            info: `File uploaded ${filesize(0)} from ${filesize(file.data?.size || 0)}`,
          },
        },
      }));
      await uploadFile(file.data, created.url, ({ progress = 0, total = 0, loaded }) => {
        set((state) => ({
          ...state,
          isLoading: true,
          status: 'uploading',
          uploadProgress: {
            ...state.uploadProgress,
            [`${created.id}`]: {
              progress: progress * 100,
              info:
                loaded !== total
                  ? `File uploaded ${filesize(loaded)} from ${filesize(total)}`
                  : 'Knowledge generation in progress ...',
            },
          },
        }));
      });
      set({
        isLoading: false,
        uploadProgress: {},
      });
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: false,
        errors: [...state.errors, error instanceof Error ? error.message : String(error)],
      }));
    }
  },
  uploadNewFile: async (file, url, onUploadProgress) => {
    try {
      set({ status: 'uploading', isLoading: true });
      await uploadFile(file, url, onUploadProgress);
      set({ status: 'default', isLoading: false });
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: false,
        errors: [...state.errors, error instanceof Error ? error.message : String(error)],
      }));
    }
  },
  updateFileName: async (id, name) => {
    try {
      set({ isLoading: true });
      const updatedFile = await updateFile(id, name);
      set((state) => ({
        ...state,
        isLoading: false,
        files: state.files.map((file) => {
          const newFile = { ...file };
          if (updatedFile.id === newFile.id) {
            newFile.name = updatedFile.name;
            newFile.date = updatedFile.date;
          }
          return newFile;
        }),
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: false,
        errors: [...state.errors, error instanceof Error ? error.message : String(error)],
      }));
    }
  },
  removeFile: async (id) => {
    try {
      set((state) => ({
        ...state,
        isLoading: true,
        files: state.files.map((file) => {
          const updatedFile = { ...file };
          if (updatedFile.id === id) {
            updatedFile.status = FileStatuses.deleting;
          }
          return updatedFile;
        }),
      }));
      await removeFile(id);
      set((state) => ({
        isLoading: false,
        files: state.files.filter((file) => file.id !== id),
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: false,
        errors: [...state.errors, error instanceof Error ? error.message : String(error)],
      }));
    }
  },
}));
