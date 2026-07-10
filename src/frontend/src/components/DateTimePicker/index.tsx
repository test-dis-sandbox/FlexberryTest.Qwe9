import * as React from 'react';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Icon } from '@mui/material';
import { Controller, ControllerProps, ControllerRenderProps, useFormContext } from 'react-hook-form';

import { StyledDateTimePicker } from './styles';
import { useFormDisabled } from '../DisabledFormProvider';

/**
 * Свойства компонента DateTimePicker
 */
interface DateTimePickerProps {
  /** Заголовок поля ввода */
  label?: string;

  /** Флаг ошибки валидации */
  error?: boolean;

  /** Является ли поле обязательным для заполнения */
  required?: boolean;

  /** Отключение поля */
  disabled?: boolean;

  /** Текст-подсказка под полем */
  helperText?: string;

  /** Минимально допустимая дата */
  minDate?: Date;

  /** Максимально допустимая дата */
  maxDate?: Date;

  /** Значение поля (Date, строка, либо null) */
  value?: Date | string | null;

  /** Растягивать поле на всю ширину */
  fullWidth?: boolean;

  /** Обработчик изменения значения */
  onChange?: (date: Date | null) => void;
}

/** Иконка открытия DateTimePicker. */
const OpenPickerIcon = () => <Icon className="icon-calendar"></Icon>;

/**
 * Компонент выбора даты и времени на базе MUI DateTimePicker.
 * @component
 * @param {DateTimePickerProps} props - Свойства компонента.
 */
export const DateTimePicker = ({
  label,
  error,
  required,
  helperText,
  minDate,
  maxDate,
  disabled,
  value,
  fullWidth = true,
  onChange,
}: DateTimePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handlePickerChange = (newValue: PickerValue) => {
    if (!onChange) {
      return;
    }

    if (newValue === null) {
      onChange(null);
      return;
    }

    if (dayjs.isDayjs(newValue) && newValue.isValid()) {
      onChange(newValue.toDate());
    }
  };

  const showCalendar = (show: boolean) => {
    setOpen(show);
    if (show) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="ru"
      localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <StyledDateTimePicker
        label={label}
        open={open}
        onClose={() => showCalendar(false)}
        onOpen={() => showCalendar(true)}
        minDate={minDate && dayjs(minDate).isValid() ? dayjs(minDate) : undefined}
        maxDate={maxDate && dayjs(maxDate).isValid() ? dayjs(maxDate) : undefined}
        disabled={disabled}
        slots={{ openPickerIcon: OpenPickerIcon }}
        value={value && dayjs(value).isValid() ? dayjs(value) : null}
        onChange={handlePickerChange}
        slotProps={{
          field: { clearable: true },
          textField: {
            onClick: () => showCalendar(true),
            inputRef: inputRef,
            required: required,
            error: error,
            helperText: helperText,
            variant: 'filled',
            fullWidth,
            InputProps: {
              disableUnderline: true,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

/**
 * Свойства для обёртки DateTimePicker с интеграцией React Hook Form
 */
interface ControlDatePickerProps extends Omit<DateTimePickerProps, 'value' | 'onChange'> {
  /** Имя поля в форме */
  name: string;

  /** Правила валидации для RHF Controller */
  rules?: ControllerProps['rules'];

  /**
   * Кастомный обработчик onChange с доступом к field
   * @param field Объект управления полем из RHF
   * @param newValue Новое значение даты
   */
  onChange?: (field: ControllerRenderProps, newValue: Date | null) => void;
}

/**
 * Обёртка над DateTimePicker, интегрированная с React Hook Form.
 * Позволяет использовать DateTimePicker как управляемый элемент формы.
 *
 * @component
 * @param {ControlDatePickerProps} props - Свойства компонента.
 */
const ControlDateTimePicker = ({ name, rules, onChange, disabled, ...props }: ControlDatePickerProps) => {
  const { control } = useFormContext();
  const { disabled: formdDisabled } = useFormDisabled();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DateTimePicker
          {...field}
          {...props}
          disabled={disabled || formdDisabled}
          value={field.value ?? null}
          onChange={(newValue) => {
            if (onChange) {
              onChange(field, newValue);
            } else {
              if (newValue === null || newValue instanceof Date) {
                field.onChange(newValue);
              }
            }
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default ControlDateTimePicker;
