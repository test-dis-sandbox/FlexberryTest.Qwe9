'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import GroupEFields from '@/modules/FormFields/GroupEFields';
import useGetGroup from '@/hooks/Group/useGetGroup';
import useUpdateGroup from '@/hooks/Group/useUpdateGroup';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { tEducationForm } from '@/enums/tEducationForm.types';
import { IGroupE } from '@/types/Group.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

export default function GroupPageEdit() {
  const viewName: string = 'GroupE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.GROUP_L);
  };

  const { data, isLoading } = useGetGroup<IGroupE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IGroupE>({
    defaultValues: {
      id: createUuid(),
      name: '',
      enrollmentYear: new Date(),
      form: tEducationForm.Correspondence,
      isMaster: false,
      fullName: '',
      departmentId: emptyGuid,
      leaderId: emptyGuid,
      leaderFullName: '',
      assistantId: null,
      assistantFullName: '',
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

  const { updateGroupAsync } = useUpdateGroup<IGroupE>(handleSuccess, handleError);

  const handleSave = async (newValue: IGroupE, close: boolean) => {
    setCloseAfter(close);
    await updateGroupAsync({ group: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.GROUP_L}${getQueryParamStateId(searchParams)}`);
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
            title="Группа"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <GroupEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
