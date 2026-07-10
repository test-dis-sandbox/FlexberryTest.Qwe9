import React, { useMemo } from 'react';
import {
  TextField,
  Autocomplete,
  Checkbox,
  Chip,
  Box,
  autocompleteClasses,
  boxClasses,
  inputBaseClasses,
} from '@mui/material';
import { Controller, ControllerProps, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { HighlightOffOutlined } from '@mui/icons-material';

import { useFormDisabled } from '@/components/DisabledFormProvider';

interface MultiSelectProps<T extends { id: string }> {
  label?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  options: T[];
  value: T[] | null;
  onChange: (value: T[] | null) => void;
  getOptionLabel: (option: T) => string;
  getOptionDisabled?: (option: T) => boolean;
}

const MultiSelect = <T extends { id: string }>({
  value,
  onChange,
  getOptionLabel,
  getOptionDisabled,
  label,
  options,
  error,
  disabled,
  required,
  helperText,
}: MultiSelectProps<T>) => {
  const sortedOptions = useMemo(() => {
    if (!value || value.length === 0) {
      return options;
    }

    const isSelected = (option: T) => value.some((valueItem) => option.id === valueItem.id);

    return [...options].sort((a, b) => {
      const aIsSelected = isSelected(a);
      const bIsSelected = isSelected(b);

      return aIsSelected === bIsSelected ? 0 : aIsSelected ? -1 : 1;
    });
  }, [options, value]);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      options={sortedOptions}
      value={value ?? []}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionDisabled={getOptionDisabled}
      onChange={(_event, newValue) => onChange(newValue)}
      sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        [`& .${inputBaseClasses.root}`]: {
          flexWrap: 'nowrap',
        },
        [`&.${autocompleteClasses.focused} .${boxClasses.root}`]: {
          maxWidth: '80%',
        },
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li
            key={key}
            {...optionProps}
          >
            <Checkbox checked={selected} />
            {getOptionLabel(option)}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          required={required}
          helperText={helperText}
          disabled={disabled}
          slotProps={{
            input: {
              ...params.InputProps,
              disableUnderline: true,
            },
          }}
        />
      )}
      renderValue={(value: T[], getItemProps) => (
        <Box
          sx={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {value.map((option: T, index: number) => {
            const { key, ...itemProps } = getItemProps({ index });
            return (
              <Chip
                label={getOptionLabel(option)}
                key={key}
                {...itemProps}
                deleteIcon={<HighlightOffOutlined />}
              />
            );
          })}
        </Box>
      )}
    />
  );
};

interface ControlMultiSelectProps<T extends { id: string }> extends Omit<MultiSelectProps<T>, 'onChange' | 'value'> {
  name: string;
  rules?: ControllerProps['rules'];
  value?: (field: ControllerRenderProps) => T[] | null;
  onChange?: (field: ControllerRenderProps, newValue: T[] | null) => void;
}

const ControlMultiSelect = <T extends { id: string }>({
  name,
  rules,
  value,
  onChange,
  disabled,
  ...props
}: ControlMultiSelectProps<T>) => {
  const { control } = useFormContext();
  const { disabled: formDisabled } = useFormDisabled();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        return (
          <MultiSelect
            {...field}
            {...props}
            disabled={disabled || formDisabled}
            value={value ? value(field) : (field.value as T[] | null)}
            onChange={(newValue: T[] | null) => {
              if (onChange) {
                onChange(field, newValue);
              } else {
                field.onChange(newValue);
              }
            }}
            error={!!error}
            helperText={error?.message}
          />
        );
      }}
    />
  );
};

export default ControlMultiSelect;
