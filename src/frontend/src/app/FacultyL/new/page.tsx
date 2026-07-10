'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import FacultyEFields from '@/modules/FormFields/FacultyEFields';
import useCreateFaculty from '@/hooks/Faculty/useCreateFaculty';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { tFacultyType } from '@/enums/tFacultyType.types';
import { IDepartmentD } from '@/types/Department.types';
import { IStudentBrigadesD } from '@/types/StudentBrigades.types';
import { IFacultyE } from '@/types/Faculty.types';

export default function FacultyPageNew() {
  const viewName: string = 'FacultyE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IFacultyE>({
    defaultValues: {
      id: createUuid(),
      name: '',
      foundationDate: new Date(),
      hasMilitaryDepartment: false,
      type: tFacultyType.chemical,
      department: [] as IDepartmentD[],
      studentBrigades: [] as IStudentBrigadesD[],
    },
  });

  const handleSuccess = (newRecord: IFacultyE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.FACULTY_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createFacultyAsync } = useCreateFaculty<IFacultyE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.FACULTY_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Факультет"
          onSave={async (newValue: IFacultyE, close: boolean) => {
            setCloseAfter(close);
            await createFacultyAsync({ faculty: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <FacultyEFields isNew />
      </Box>
    </FormProvider>
  );
}
