'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import StudyPlanEFields from '@/modules/FormFields/StudyPlanEFields';
import useGetStudyPlan from '@/hooks/StudyPlan/useGetStudyPlan';
import useUpdateStudyPlan from '@/hooks/StudyPlan/useUpdateStudyPlan';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IStudyPlanE } from '@/types/StudyPlan.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function StudyPlanPageEdit() {
  const viewName: string = 'StudyPlanE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.STUDY_PLAN_L);
  };

  const { data, isLoading } = useGetStudyPlan<IStudyPlanE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IStudyPlanE>({
    defaultValues: {
      id: createUuid(),
      creationDate: new Date(),
      hasPractice: false,
      specialization: '',
      totalHours: 0,
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

  const { updateStudyPlanAsync } = useUpdateStudyPlan<IStudyPlanE>(handleSuccess, handleError);

  const handleSave = async (newValue: IStudyPlanE, close: boolean) => {
    setCloseAfter(close);
    await updateStudyPlanAsync({ studyPlan: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.STUDY_PLAN_L}${getQueryParamStateId(searchParams)}`);
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
            title="Учебный план"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <StudyPlanEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
