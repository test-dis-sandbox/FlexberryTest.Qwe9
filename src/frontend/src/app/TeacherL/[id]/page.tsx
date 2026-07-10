'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import TeacherEFields from '@/modules/FormFields/TeacherEFields';
import useGetTeacher from '@/hooks/Teacher/useGetTeacher';
import useUpdateTeacher from '@/hooks/Teacher/useUpdateTeacher';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { tAcademicDegree } from '@/enums/tAcademicDegree.types';
import { ITeacherE } from '@/types/Teacher.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function TeacherPageEdit() {
  const viewName: string = 'TeacherE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.TEACHER_L);
  };

  const { data, isLoading } = useGetTeacher<ITeacherE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<ITeacherE>({
    defaultValues: {
      id: createUuid(),
      dateOfBirth: new Date(),
      degree: tAcademicDegree.CandidateOfSciences,
      fullName: '',
      partTime: false,
      studyPlanId: null,
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

  const { updateTeacherAsync } = useUpdateTeacher<ITeacherE>(handleSuccess, handleError);

  const handleSave = async (newValue: ITeacherE, close: boolean) => {
    setCloseAfter(close);
    await updateTeacherAsync({ teacher: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.TEACHER_L}${getQueryParamStateId(searchParams)}`);
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
            title="Преподаватель"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <TeacherEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
