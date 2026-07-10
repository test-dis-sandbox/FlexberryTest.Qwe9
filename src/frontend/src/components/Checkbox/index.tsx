import { Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { Controller, ControllerProps, ControllerRenderProps, useFormContext } from 'react-hook-form';

import { useFormDisabled } from '../DisabledFormProvider';

interface CheckboxProps {
  id?: string;
  label?: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, disabled = false, onChange }) => {
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={(_event, checked) => onChange?.(checked)}
          sx={{ py: 1.75 }}
        />
      }
      label={label}
    />
  );
};

interface ControlCheckboxProps extends Omit<CheckboxProps, 'checked' | 'onChange'> {
  name: string;
  rules?: ControllerProps['rules'];
  onChange?: (field: ControllerRenderProps, newValue: boolean) => void;
}

const ControlCheckbox = ({ name, rules, onChange, disabled, ...props }: ControlCheckboxProps) => {
  const { control } = useFormContext();
  const { disabled: formDisabled } = useFormDisabled();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <Checkbox
          {...field}
          {...props}
          disabled={disabled || formDisabled}
          onChange={(newValue) => {
            if (onChange) {
              onChange(field, newValue);
            } else {
              field.onChange(newValue);
            }
          }}
          checked={field.value}
        />
      )}
    />
  );
};

export default ControlCheckbox;
