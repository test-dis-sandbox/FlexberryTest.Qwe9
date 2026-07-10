'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import ScheduleEFields from '@/modules/FormFields/ScheduleEFields';
import useGetSchedule from '@/hooks/Schedule/useGetSchedule';
import useUpdateSchedule from '@/hooks/Schedule/useUpdateSchedule';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { ILessonD } from '@/types/Lesson.types';
import { IScheduleGroupD } from '@/types/ScheduleGroup.types';
import { IScheduleE } from '@/types/Schedule.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function SchedulePageEdit() {
  const viewName: string = 'ScheduleE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.SCHEDULE_L);
  };

  const { data, isLoading } = useGetSchedule<IScheduleE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IScheduleE>({
    defaultValues: {
      id: createUuid(),
      year: 0,
      week: 0,
      day: 0,
      dateFrom: new Date(),
      lessons: [] as ILessonD[],
      groups: [] as IScheduleGroupD[],
    },
  });

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updateScheduleAsync } = useUpdateSchedule<IScheduleE>(handleSuccess, handleError);

  const handleSave = async (newValue: IScheduleE, close: boolean) => {
    setCloseAfter(close);
    await updateScheduleAsync({ schedule: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.SCHEDULE_L}${getQueryParamStateId(searchParams)}`);
  };

  useEffect(() => {
    if (!isLoading && data) {
      methods.reset(data);
    }
  }, [data, isLoading, methods]);

  if (isLoading) {
    return <CircularProgressCenter />;
  }

  return (
    <FormProvider {...methods}>
      <DisabledFormProvider disabled={mode === 'readonly'}>
        <Box component="form">
          <EditFormToolbar
            title="Расписание"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <ScheduleEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
