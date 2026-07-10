import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ruRU } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import { CalendarTodayOutlined } from '@mui/icons-material';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { Controller, ControllerProps, ControllerRenderProps, useFormContext } from 'react-hook-form';

import { DateOnly } from '@/utils/dateUtils';

import { StyledDatePicker } from './styles';
import { useFormDisabled } from '../DisabledFormProvider';

interface DatePickerProps {
  label?: string;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  value?: DateOnly | Date | string | null;
  fullWidth?: boolean;
  onChange?: (date: DateOnly | null) => void;
}

export const DatePicker = ({
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
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLBaseElement>(null);
  const handlePickerChange = (newValue: PickerValue) => {
    if (!onChange) {
      return;
    }

    if (newValue === null) {
      onChange(null);
      return;
    }

    if (dayjs.isDayjs(newValue) && newValue.isValid()) {
      onChange(new DateOnly(newValue.toDate()));
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
      <StyledDatePicker
        label={label}
        open={open}
        onClose={() => showCalendar(false)}
        onOpen={() => showCalendar(true)}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        disabled={disabled}
        slots={{ openPickerIcon: () => <CalendarTodayOutlined /> }}
        value={value ? dayjs(value instanceof DateOnly ? value.toDate() : value) : null}
        onChange={handlePickerChange}
        slotProps={{
          field: { clearable: true },
          textField: {
            onClick: () => showCalendar(true),
            inputRef: inputRef,
            required: required,
            error: error,
            helperText: helperText,
            fullWidth,
          },
        }}
      />
    </LocalizationProvider>
  );
};

interface ControlDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  name: string;
  rules?: ControllerProps['rules'];
  onChange?: (field: ControllerRenderProps, newValue: DateOnly | null) => void;
}

const ControlDatePicker = ({ name, rules, onChange, disabled, ...props }: ControlDatePickerProps) => {
  const { control } = useFormContext();
  const { disabled: formdDisabled } = useFormDisabled();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          {...props}
          disabled={disabled || formdDisabled}
          onChange={(newValue) => {
            if (onChange) {
              onChange(field, newValue);
            } else {
              field.onChange(newValue);
            }
          }}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
};

export default ControlDatePicker;
