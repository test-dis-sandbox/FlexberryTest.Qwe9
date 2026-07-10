'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import StudyPlanEFields from '@/modules/FormFields/StudyPlanEFields';
import useCreateStudyPlan from '@/hooks/StudyPlan/useCreateStudyPlan';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { IStudyPlanE } from '@/types/StudyPlan.types';

export default function StudyPlanPageNew() {
  const viewName: string = 'StudyPlanE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IStudyPlanE>({
    defaultValues: {
      id: createUuid(),
      creationDate: new Date(),
      hasPractice: false,
      specialization: '',
      totalHours: 0,
    },
  });

  const handleSuccess = (newRecord: IStudyPlanE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.STUDY_PLAN_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createStudyPlanAsync } = useCreateStudyPlan<IStudyPlanE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.STUDY_PLAN_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Учебный план"
          onSave={async (newValue: IStudyPlanE, close: boolean) => {
            setCloseAfter(close);
            await createStudyPlanAsync({ studyPlan: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <StudyPlanEFields isNew />
      </Box>
    </FormProvider>
  );
}
