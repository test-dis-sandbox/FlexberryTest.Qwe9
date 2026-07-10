import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { useEffect } from 'react';

import ConfirmationDialog from '@/components/ConfirmationDialog';
import ControlDatePicker from '@/components/DatePicker';
import { useNotification } from '@/components/Notification';
import { getErrorMessages } from '@/utils/errorsUtils';
import { DateOnly } from '@/utils/dateUtils';

interface SelectOperationRenameModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAgree: (renameDate: DateOnly | null) => void;
  onDisagree: () => void;
}

const SelectOperationRenameModal = ({ open, setOpen, onAgree, onDisagree }: SelectOperationRenameModalProps) => {
  const { showError } = useNotification();

  const methods = useForm<{ renameDate: DateOnly | null }>({
    defaultValues: { renameDate: null },
  });

  useEffect(() => {
    if (!open) {
      methods.reset({ renameDate: null });
    }
  }, [methods, open]);

  const handleInvalidForm = (error: FieldErrors) => {
    const errorMessages = getErrorMessages(error);
    showError(errorMessages);
  };

  return (
    <FormProvider {...methods}>
      <ConfirmationDialog
        open={open}
        setOpen={setOpen}
        handleAgree={methods.handleSubmit(
          (data) => {
            onAgree(data.renameDate);
            setOpen(false);
          },
          (errors) => handleInvalidForm(errors)
        )}
        handleDisagree={() => {
          onDisagree();
          setOpen(false);
        }}
        title="Выбор операции переименования"
        description="Выполнить переименование объекта в справочнике или внести исправление?"
        captionAgree="Переименовать"
        captionDisagree="Внести правки"
        closeOnAgree={false}
        closeOnDisagree={false}
      >
        <Box my={2}>
          <ControlDatePicker
            name="renameDate"
            label="Дата переименования"
            rules={{
              required: 'Дата переименования - обязательное поле.',
              validate: (record) =>
                !record ||
                record <= new Date() ||
                (record instanceof DateOnly && record.toDate() <= new Date()) ||
                'Дата переименования не может быть больше текущей даты.',
            }}
          />
        </Box>
      </ConfirmationDialog>
    </FormProvider>
  );
};

export default SelectOperationRenameModal;
