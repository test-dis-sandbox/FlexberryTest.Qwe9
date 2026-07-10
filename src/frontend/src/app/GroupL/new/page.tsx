'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import GroupEFields from '@/modules/FormFields/GroupEFields';
import useCreateGroup from '@/hooks/Group/useCreateGroup';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';
import { tEducationForm } from '@/enums/tEducationForm.types';
import { IGroupE } from '@/types/Group.types';

export default function GroupPageNew() {
  const viewName: string = 'GroupE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

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

  const handleSuccess = (newRecord: IGroupE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.GROUP_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createGroupAsync } = useCreateGroup<IGroupE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.GROUP_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="Группа"
          onSave={async (newValue: IGroupE, close: boolean) => {
            setCloseAfter(close);
            await createGroupAsync({ group: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <GroupEFields isNew />
      </Box>
    </FormProvider>
  );
}
