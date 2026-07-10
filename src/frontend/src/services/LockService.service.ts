import axiosInstance from '@/api/instance';

/**
 * Сервис блокировок.
 */
export class LockService {
  async lock(dataObjectId: string) {
    const response = await axiosInstance.put<{ access: boolean; userEmail: string | null; name: string | null }>(
      `/lock/${dataObjectId}`,
      null,
      {}
    );

    return response;
  }

  async unlock(dataObjectId: string) {
    const response = await axiosInstance.delete<boolean>(`/lock/${dataObjectId}`);

    return response;
  }
}
