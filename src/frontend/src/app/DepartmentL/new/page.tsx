'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import DepartmentEFields from '@/modules/FormFields/DepartmentEFields';
import useCreateDepartment from '@/hooks/Department/useCreateDepartment';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';
import { tDirection } from '@/enums/tDirection.types';
import { IGroupD } from '@/types/Group.types';
import { IDepartmentE } from '@/types/Department.types';

export default function DepartmentPageNew() {
  const viewName: string = 'DepartmentE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

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

  const handleSuccess = (newRecord: IDepartmentE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.DEPARTMENT_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createDepartmentAsync } = useCreateDepartment<IDepartmentE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.DEPARTMENT_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Кафедра"
          onSave={async (newValue: IDepartmentE, close: boolean) => {
            setCloseAfter(close);
            await createDepartmentAsync({ department: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <DepartmentEFields isNew />
      </Box>
    </FormProvider>
  );
}
