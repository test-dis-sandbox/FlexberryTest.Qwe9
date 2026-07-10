import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { FileService } from '@/services/File.service';

interface UploadFileOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (result: WebFile) => void;
  onError?: (e: AxiosError | Error) => void;
}

const useUploadFile = ({ onProgress, onSuccess, onError }: UploadFileOptions = {}) => {
  const { mutateAsync, isPending, isError } = useMutation({
    mutationFn: async (file: File) => await FileService.UploadFile(file, onProgress),
    onSuccess: (response) => {
      if (typeof onSuccess === 'function') {
        onSuccess(response.data);
      }
    },
    onError: (e: AxiosError | Error) => {
      if (typeof onError === 'function') {
        onError(e);
      }
    },
  });

  return { mutateAsync, isPending, isError };
};

export default useUploadFile;
