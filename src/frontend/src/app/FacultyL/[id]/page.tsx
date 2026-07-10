'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import FacultyEFields from '@/modules/FormFields/FacultyEFields';
import useGetFaculty from '@/hooks/Faculty/useGetFaculty';
import useUpdateFaculty from '@/hooks/Faculty/useUpdateFaculty';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IDepartmentD } from '@/types/Department.types';
import { IStudentBrigadesD } from '@/types/StudentBrigades.types';
import { tFacultyType } from '@/enums/tFacultyType.types';
import { IFacultyE } from '@/types/Faculty.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function FacultyPageEdit() {
  const viewName: string = 'FacultyE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.FACULTY_L);
  };

  const { data, isLoading } = useGetFaculty<IFacultyE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

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

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updateFacultyAsync } = useUpdateFaculty<IFacultyE>(handleSuccess, handleError);

  const handleSave = async (newValue: IFacultyE, close: boolean) => {
    setCloseAfter(close);
    await updateFacultyAsync({ faculty: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.FACULTY_L}${getQueryParamStateId(searchParams)}`);
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
            title="Факультет"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <FacultyEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
