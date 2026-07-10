import { useCallback, useState } from 'react';
import { Controller, ControllerProps, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { Box, Typography } from '@mui/material';

import { useFormDisabled } from '@/components/DisabledFormProvider';
import useDownloadFile from '@/hooks/WebFile/useDownloadFile';
import useUploadFile from '@/hooks/WebFile/useUploadFile';
import { downloadResponse } from '@/utils/downloadResponse';

import { FileInfoDisplay, LinearProgressWithLabel } from './FileInfoDisplay';
import { useFileInput } from './FileInput';
import { DropZone } from './DropZone.styles';

interface FilePickerProps {
  /** Максимальный размер файла в мегабайтах. */
  maxSizeMB?: number;

  /** Массив строк с разрешенными расширениями файлов (например, ['.jpg', '.png']). */
  accept?: string[];

  /** Значение поля. */
  value: WebFile;

  /**
   * Если `true`, то компонент отключен.
   * @default false
   */
  disabled?: boolean;

  /** Обработчик изменения значения. */
  onChange?: (file: WebFile | null) => void;
  hasError?: boolean;
  helperText?: string;
}

const FilePicker = ({
  maxSizeMB = 100,
  accept,
  value,
  disabled = false,
  onChange,
  hasError,
  helperText,
}: FilePickerProps) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const { mutateAsync: fileDownload } = useDownloadFile();
  const { mutateAsync: fileUpload } = useUploadFile({
    onProgress: (progress: number) => {
      setProgress(progress);
    },
  });

  const handleDownload = useCallback(async () => {
    if (!value) {
      return;
    }

    await fileDownload(value).then((response) => {
      downloadResponse(response.data, value.name);
    });
  }, [fileDownload, value]);

  const handleUpload = useCallback(
    async (data: File | File[] | null) => {
      const resolveFile = Array.isArray(data) ? data[0] : data;
      if (!resolveFile) {
        return;
      }

      await fileUpload(resolveFile)
        .then((response) => {
          if (typeof onChange === 'function') {
            onChange(response.data);
          }
        })
        .catch(() => {
          if (typeof onChange === 'function') {
            onChange(null);
          }
        })
        .finally(() => {
          setProgress(null);
        });
    },
    [fileUpload, onChange]
  );

  const {
    openFileDialog,
    getInputProps,
    getDropZoneProps,
    resetState,
    inputState: { isDragging, isValid, error },
  } = useFileInput({
    accept,
    maxSizeMB,
    disabled,
    onUpload: handleUpload,
  });

  const handleClear = useCallback(() => {
    if (!value) {
      return;
    }

    setOpen(false);
    resetState();
    setProgress(null);

    if (typeof onChange === 'function') {
      onChange(null);
    }
  }, [onChange, resetState, value]);

  const renderFileInfoDisplay = () => {
    if (progress) {
      return (
        <LinearProgressWithLabel
          sx={{ width: '100%' }}
          value={progress}
        />
      );
    }

    if (value) {
      return (
        <FileInfoDisplay
          file={value}
          open={open}
          disabled={disabled}
          onDownload={handleDownload}
          onClear={handleClear}
        />
      );
    }

    return (
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ fontFamily: 'Lato, sans-serif' }}
      >
        {isValid ? 'Перетащите файл или кликните для выбора' : error}
      </Typography>
    );
  };

  return (
    <Box fontFamily="Lato, sans-serif">
      {helperText && (
        <Typography
          color="error"
          variant="subtitle2"
        >
          {helperText}
        </Typography>
      )}
      <DropZone
        {...getDropZoneProps()}
        onClick={!value ? () => openFileDialog() : () => {}}
        sx={(theme) => ({
          ...(isDragging ? { border: `1px dashed ${theme.palette.primary.main}` } : {}),
          ...(!isValid || hasError ? { border: `1px dashed ${theme.palette.error.main}` } : {}),
        })}
      >
        {renderFileInfoDisplay()}
      </DropZone>
      <input {...getInputProps()} />
    </Box>
  );
};

interface ControlFilePickerProps extends Omit<FilePickerProps, 'value' | 'onChange'> {
  /** Имя поля в форме. */
  name: string;

  /** Правила валидации для RHF Controller. */
  rules?: ControllerProps['rules'];

  /**
   * Кастомный обработчик onChange с доступом к field.
   * @param field Объект управления полем из RHF.
   * @param newValue Новое значение файлового поля.
   */
  onChange?: (field: ControllerRenderProps, newValue: WebFile | null) => void;
}

/**
 * Обёртка над FilePicker, интегрированная с React Hook Form.
 * Позволяет использовать FilePicker как управляемый элемент формы.
 *
 * @component
 * @param {ControlFilePickerProps} props - Свойства компонента.
 */
export const ControlFilePicker = ({ name, rules, disabled, onChange, ...props }: ControlFilePickerProps) => {
  const { control } = useFormContext();
  const { disabled: formDisabled } = useFormDisabled();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FilePicker
          {...field}
          {...props}
          disabled={disabled || formDisabled}
          hasError={!!error}
          helperText={error?.message}
          onChange={(newValue) => {
            if (onChange) {
              onChange(field, newValue);
            } else {
              field.onChange(newValue);
            }
          }}
        />
      )}
    />
  );
};
