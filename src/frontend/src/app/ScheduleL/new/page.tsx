'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import ScheduleEFields from '@/modules/FormFields/ScheduleEFields';
import useCreateSchedule from '@/hooks/Schedule/useCreateSchedule';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { ILessonD } from '@/types/Lesson.types';
import { IScheduleGroupD } from '@/types/ScheduleGroup.types';
import { IScheduleE } from '@/types/Schedule.types';

export default function SchedulePageNew() {
  const viewName: string = 'ScheduleE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

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

  const handleSuccess = (newRecord: IScheduleE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.SCHEDULE_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createScheduleAsync } = useCreateSchedule<IScheduleE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.SCHEDULE_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Расписание"
          onSave={async (newValue: IScheduleE, close: boolean) => {
            setCloseAfter(close);
            await createScheduleAsync({ schedule: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <ScheduleEFields isNew />
      </Box>
    </FormProvider>
  );
}
