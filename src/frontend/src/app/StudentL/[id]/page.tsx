'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import StudentEFields from '@/modules/FormFields/StudentEFields';
import useGetStudent from '@/hooks/Student/useGetStudent';
import useUpdateStudent from '@/hooks/Student/useUpdateStudent';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { tStudentStatus } from '@/enums/tStudentStatus.types';
import { IStudentE } from '@/types/Student.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

export default function StudentPageEdit() {
  const viewName: string = 'StudentE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.STUDENT_L);
  };

  const { data, isLoading } = useGetStudent<IStudentE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IStudentE>({
    defaultValues: {
      id: createUuid(),
      enrollmentDate: new Date(),
      fullName: '',
      isBudget: false,
      status: tStudentStatus.AcademicLeave,
      studentId: '',
      teacherId: emptyGuid,
      planId: emptyGuid,
      groupId: null,
      groupName: '',
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

  const { updateStudentAsync } = useUpdateStudent<IStudentE>(handleSuccess, handleError);

  const handleSave = async (newValue: IStudentE, close: boolean) => {
    setCloseAfter(close);
    await updateStudentAsync({ student: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.STUDENT_L}${getQueryParamStateId(searchParams)}`);
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
            title="Студент"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <StudentEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
