import { AxiosProgressEvent } from 'axios';

import axiosInstance from '@/api/instance';

function getProgressPercentage(progressEvent: AxiosProgressEvent): number {
  if (!progressEvent.total) {
    return 0;
  }

  const percent = (progressEvent.loaded / progressEvent.total) * 100;
  return Math.min(Math.round(percent * 100) / 100, 100);
}

export const FileService = {
  async DownloadFile(file: WebFile, onDownload?: (progress: number) => void) {
    const response = await axiosInstance.post<Blob>(`/file/download`, file, {
      responseType: 'blob',
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        if (typeof onDownload === 'function') {
          const percent = getProgressPercentage(progressEvent);
          onDownload(percent);
        }
      },
    });

    return response;
  },

  async UploadFile(file: File, onUpload?: (progress: number) => void) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<WebFile>(`/file/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (typeof onUpload === 'function') {
          const percent = getProgressPercentage(progressEvent);
          onUpload(percent);
        }
      },
    });

    return response;
  },
};
