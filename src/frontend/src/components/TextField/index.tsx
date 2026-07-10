import { TextField as MuiTextField } from '@mui/material';
import { Controller, ControllerProps, ControllerRenderProps, useFormContext } from 'react-hook-form';

import { useFormDisabled } from '../DisabledFormProvider';

interface ControlTextFieldProps extends Omit<React.ComponentProps<typeof MuiTextField>, 'value' | 'onChange'> {
  name: string;
  rules?: ControllerProps['rules'];
  onChange?: (field: ControllerRenderProps, newValue: string | number | null) => void;
}

const ControlTextField = ({ name, rules, onChange, disabled, ...props }: ControlTextFieldProps) => {
  const { control } = useFormContext();
  const { disabled: formDisabled } = useFormDisabled();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          {...props}
          disabled={disabled || formDisabled}
          value={field.value ?? ''}
          onChange={(e) => {
            if (onChange) {
              onChange(field, e.target.value);
            } else {
              field.onChange(e.target.value);
            }
          }}
          error={!!error}
          helperText={error?.message}
          fullWidth
        />
      )}
    />
  );
};

export default ControlTextField;
