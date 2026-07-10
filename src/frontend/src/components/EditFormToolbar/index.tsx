'use client';

import { Button, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { FieldErrors, FieldValues, useFormContext } from 'react-hook-form';
import { Check, Close, DoneAll, LockOutlined, PrintOutlined } from '@mui/icons-material';

import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useNotification } from '@/components/Notification';
import { useFormDisabled } from '@/components/DisabledFormProvider';
import { getErrorMessages } from '@/utils/errorsUtils';

interface EditFormToolbarProps<T> {
  title: string;
  subtitle?: string;
  showSave?: boolean;
  showSaveClose?: boolean;
  onSave: (newValue: T, close: boolean) => Promise<void>;
  onTransition: () => void;
  showPrint?: boolean;
  onPrint?: () => void;
  showLock?: boolean;
  onLock?: () => void;
}

const EditFormToolbar = <T extends FieldValues>({
  title,
  subtitle,
  showSave = true,
  showSaveClose = true,
  onSave,
  onTransition,
  showPrint = false,
  onPrint,
  showLock = false,
  onLock,
}: EditFormToolbarProps<T>) => {
  const [open, setOpen] = useState(false);

  const { showError } = useNotification();
  const { disabled: formDisabled } = useFormDisabled();

  const handleInvalidForm = (error: FieldErrors<T>) => {
    const errorMessages = getErrorMessages(error);
    showError(errorMessages);
  };

  const handleSaveButtonClick = async (data: T, close: boolean) => {
    if (isDirty && !isSubmitting) {
      await onSave(data, close);
    }
  };

  const handleCloseButtonClick = () => {
    if (isDirty) {
      setOpen(true);
    } else {
      onTransition();
    }
  };

  const {
    handleSubmit,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
  } = useFormContext<T>();

  return (
    <>
      <Stack
        direction="row"
        flexWrap="wrap"
        alignItems="center"
        spacing={1}
        useFlexGap
      >
        <Typography
          variant="h1"
          component="h2"
          sx={{
            flex: '1',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="subtitle1"
            order={{ xs: 2, lg: 3 }}
            sx={(theme) => ({
              color: theme.palette.text.secondary,
              flexBasis: '100%',
            })}
          >
            {subtitle}
          </Typography>
        )}
        <Stack
          direction="row"
          spacing={2}
          order={{ xs: 3, lg: 2 }}
          sx={{ flexBasis: { xs: '100%', lg: 'auto' } }}
        >
          {showSave && (
            <Tooltip title={isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}>
              <Button
                variant="contained"
                startIcon={<Check />}
                disabled={!isDirty || isSubmitSuccessful || isSubmitting || formDisabled}
                onClick={handleSubmit(
                  (data) => handleSaveButtonClick(data, false),
                  (errors) => handleInvalidForm(errors)
                )}
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Tooltip>
          )}
          {showSaveClose && (
            <Tooltip title={isSubmitting ? 'Сохранение...' : 'Сохранить изменения и закрыть'}>
              <Button
                variant="contained"
                startIcon={<DoneAll />}
                disabled={!isDirty || isSubmitSuccessful || isSubmitting || formDisabled}
                onClick={handleSubmit(
                  (data) => handleSaveButtonClick(data, true),
                  (errors) => handleInvalidForm(errors)
                )}
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить и закрыть'}
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Закрыть">
            <Button
              variant="contained"
              startIcon={<Close />}
              onClick={handleCloseButtonClick}
            >
              Закрыть
            </Button>
          </Tooltip>
          {showPrint && (
            <Tooltip title="Печать">
              <Button
                variant="contained"
                startIcon={<PrintOutlined />}
                onClick={onPrint}
              >
                Печать
              </Button>
            </Tooltip>
          )}
          {showLock && (
            <>
              <Divider
                orientation="vertical"
                variant="middle"
                flexItem
              />
              <Tooltip title="Блокировка">
                <IconButton
                  color="primary"
                  aria-label="Блокировка"
                  onClick={onLock}
                >
                  <LockOutlined />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </Stack>
      <ConfirmationDialog
        open={open}
        setOpen={setOpen}
        handleAgree={onTransition}
      />
    </>
  );
};

export default EditFormToolbar;
