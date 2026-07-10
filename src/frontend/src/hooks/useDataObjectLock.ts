import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { LockService } from '@/services/LockService.service';
import { useNotification } from '@/components/Notification';
import { isNullOrWhiteSpace } from '@/utils/stringUtils';
import { getPublicEnv } from '@/utils/envUtils';
const lockService = new LockService();
type LockMode = 'edit' | 'readonly';
const apiUrl = getPublicEnv().BACKEND_URL;
export function useDataObjectLock(dataObjectId: string) {
  const { showWarning } = useNotification();
  const hasLockRef = useRef(false);
  const warnedRef = useRef(false);
  const searchParams = useSearchParams();
  const localReadonly = searchParams.get('readonly') as null | 'false' | 'true';
  const retriedRef = useRef(false);
  const {
    data: unlocked,
    isError,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['lock', dataObjectId],
    queryFn: () => lockService.lock(dataObjectId),
    select: ({ data }) => {
      const access = Boolean(data?.access);
      if (!access && !warnedRef.current) {
        const { userEmail, name } = data;
        const displayUserField = name ?? userEmail;
        warnedRef.current = true;
        showWarning(
          `Запись заблокирована другим пользователем: ${isNullOrWhiteSpace(displayUserField) ? 'неопределен' : displayUserField}.`
        );
      }
      return access;
    },
    enabled: Boolean(dataObjectId),
  });
  useEffect(() => {
    if (unlocked === true && !retriedRef.current) {
      // Если получили доступ, сделать еще один запрос через 10 секунд на подтверждение.
      // Бывает сервер отвечает неактуальным состоянием и форма на клиенте отображается разблокированной.
      retriedRef.current = true;
      const timer = setTimeout(() => {
        refetch();
      }, 10_000);
      return () => clearTimeout(timer);
    }
  }, [unlocked, refetch]);
  useEffect(() => {
    if (isSuccess && unlocked) {
      hasLockRef.current = true;
    }
  }, [isSuccess, unlocked]);
  const sendUnlock = useCallback(() => {
    if (!hasLockRef.current) {
      return;
    }
    fetch(`${apiUrl}/lock/${dataObjectId}`, {
      method: 'post',
      keepalive: true,
    });
  }, [dataObjectId]);
  useEffect(() => {
    const handleUnload = () => {
      sendUnlock();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      sendUnlock();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [sendUnlock]);
  const mode: LockMode = useMemo(() => {
    if (isSuccess && unlocked && (!localReadonly || localReadonly === 'false')) {
      return 'edit';
    }
    if (isError) {
      return 'readonly';
    }
    return 'readonly';
  }, [isError, isSuccess, localReadonly, unlocked]);
  const result = useMemo(() => ({ mode }), [mode]);
  return result;
}
