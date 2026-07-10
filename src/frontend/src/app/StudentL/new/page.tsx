'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import StudentEFields from '@/modules/FormFields/StudentEFields';
import useCreateStudent from '@/hooks/Student/useCreateStudent';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';
import { tStudentStatus } from '@/enums/tStudentStatus.types';
import { IStudentE } from '@/types/Student.types';

export default function StudentPageNew() {
  const viewName: string = 'StudentE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

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

  const handleSuccess = (newRecord: IStudentE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.STUDENT_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createStudentAsync } = useCreateStudent<IStudentE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.STUDENT_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Студент"
          onSave={async (newValue: IStudentE, close: boolean) => {
            setCloseAfter(close);
            await createStudentAsync({ student: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <StudentEFields isNew />
      </Box>
    </FormProvider>
  );
}
