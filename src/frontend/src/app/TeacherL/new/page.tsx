'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import TeacherEFields from '@/modules/FormFields/TeacherEFields';
import useCreateTeacher from '@/hooks/Teacher/useCreateTeacher';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { tAcademicDegree } from '@/enums/tAcademicDegree.types';
import { ITeacherE } from '@/types/Teacher.types';

export default function TeacherPageNew() {
  const viewName: string = 'TeacherE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

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

  const handleSuccess = (newRecord: ITeacherE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.TEACHER_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createTeacherAsync } = useCreateTeacher<ITeacherE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.TEACHER_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Преподаватель"
          onSave={async (newValue: ITeacherE, close: boolean) => {
            setCloseAfter(close);
            await createTeacherAsync({ teacher: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <TeacherEFields isNew />
      </Box>
    </FormProvider>
  );
}
