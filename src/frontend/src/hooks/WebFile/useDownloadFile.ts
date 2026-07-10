import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { FileService } from '@/services/File.service';

interface DownloadFileOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (result: Blob) => void;
  onError?: (e: AxiosError | Error) => void;
}

const useDownloadFile = ({ onProgress, onSuccess, onError }: DownloadFileOptions = {}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (file: WebFile) => await FileService.DownloadFile(file, onProgress),
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

  return { mutateAsync, isPending };
};

export default useDownloadFile;
