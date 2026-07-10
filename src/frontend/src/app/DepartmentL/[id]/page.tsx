'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import DepartmentEFields from '@/modules/FormFields/DepartmentEFields';
import useGetDepartment from '@/hooks/Department/useGetDepartment';
import useUpdateDepartment from '@/hooks/Department/useUpdateDepartment';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IGroupD } from '@/types/Group.types';
import { tDirection } from '@/enums/tDirection.types';
import { IDepartmentE } from '@/types/Department.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

export default function DepartmentPageEdit() {
  const viewName: string = 'DepartmentE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.DEPARTMENT_L);
  };

  const { data, isLoading } = useGetDepartment<IDepartmentE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IDepartmentE>({
    defaultValues: {
      id: createUuid(),
      name: '',
      foundationDate: new Date(),
      hasAdditionalEducation: false,
      specialization: tDirection.ComputerScience,
      document: null,
      facultyId: emptyGuid,
      group: [] as IGroupD[],
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

  const { updateDepartmentAsync } = useUpdateDepartment<IDepartmentE>(handleSuccess, handleError);

  const handleSave = async (newValue: IDepartmentE, close: boolean) => {
    setCloseAfter(close);
    await updateDepartmentAsync({ department: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.DEPARTMENT_L}${getQueryParamStateId(searchParams)}`);
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
            title="Кафедра"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <DepartmentEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
