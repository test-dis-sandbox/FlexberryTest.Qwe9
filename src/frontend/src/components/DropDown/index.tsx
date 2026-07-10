import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { TextField, Autocomplete, CircularProgress, IconButton, Icon } from '@mui/material';
import { Controller, ControllerProps, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { buttonBaseClasses } from '@mui/material/ButtonBase';
import { inputBaseClasses } from '@mui/material/InputBase';
import { Visibility } from '@mui/icons-material';

import { useFormDisabled } from '@/components/DisabledFormProvider';

export interface DropdownItem<A extends { id: string }> {
  object?: A | null;
  value: string;
  label: string;
}

interface DropdownBaseProps {
  label?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  hiddenClearIcon?: boolean;
  hasNext?: boolean;
  loading?: boolean;
  onOpen?: (event: React.SyntheticEvent) => void;
  onScrollEnd?: () => void;
  onSearch?: (value: string | null) => void;
}

interface DropdownEnumProps<E extends Record<string, string>> extends DropdownBaseProps {
  options: E;
  value: E[keyof E] | null;
  onChange: (value: E[keyof E] | null) => void;
}

interface DropdownArrayProps<T extends { id: string }> extends DropdownBaseProps {
  options: T[];
  value: string | null;
  defaultValue?: string;
  onChange: (value: string | null, option: T | null) => void;
  getOptionLabel: (option: T) => string;
  getOptionDisabled?: (option: DropdownItem<T>) => boolean;
  getViewTransition?: ((value: string) => void) | string;
}

type DropdownProps<E extends Record<string, string>, T extends { id: string }> =
  | DropdownEnumProps<E>
  | DropdownArrayProps<T>;

const useDebounce = (callback?: (value: string) => void, delay?: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (value: string) => {
      if (typeof callback !== 'function') {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay]
  );
};

export const Dropdown = <E extends Record<string, string>, T extends { id: string }>(props: DropdownProps<E, T>) => {
  const isEnum = !Array.isArray((props as DropdownArrayProps<T>).options);

  const {
    options,
    value,
    defaultValue,
    onChange,
    getOptionLabel,
    getOptionDisabled,
    getViewTransition,
    label,
    error,
    disabled,
    required,
    helperText,
    hiddenClearIcon,
    hasNext,
    loading,
    onOpen,
    onScrollEnd,
    onSearch,
  } = props as DropdownArrayProps<T> & DropdownEnumProps<E>;

  const listboxRef = useRef<HTMLUListElement>(null);
  const scrollPosition = useRef<number>(0);

  const debouncedInputChange = useDebounce(onSearch, 1000);

  useEffect(() => {
    if (listboxRef.current) {
      listboxRef.current.scrollTop = scrollPosition.current;
    }
  });

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLUListElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      const isEndOfList = scrollHeight - scrollTop <= clientHeight + 50;

      if (listboxRef.current) {
        scrollPosition.current = scrollTop;
      }

      if (typeof onScrollEnd === 'function' && isEndOfList && !loading && hasNext) {
        onScrollEnd();
      }
    },
    [hasNext, loading, onScrollEnd]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      debouncedInputChange(value);
    },
    [debouncedInputChange]
  );

  const items: DropdownItem<T>[] = useMemo(() => {
    if (isEnum) {
      return Object.values(options).map((label) => ({ value: label, label, object: null }));
    }

    return options.map((opt) => ({
      value: opt.id,
      label: getOptionLabel(opt),
      object: opt,
    }));
  }, [getOptionLabel, isEnum, options]);

  const itemsMap = useMemo<Record<string, DropdownItem<T>>>(() => {
    const map: Record<string, DropdownItem<T>> = {};
    items.forEach((item) => {
      map[item.value] = item;
    });
    return map;
  }, [items]);

  const selected = useMemo<DropdownItem<T> | null>(() => {
    if (!value) {
      return null;
    }

    if (isEnum) {
      return { value, label: value };
    } else {
      const selectedValue = itemsMap[value] ?? null;
      if (!selectedValue && defaultValue) {
        return {
          value,
          label: defaultValue,
          object: null,
        };
      }

      return selectedValue;
    }
  }, [isEnum, value, defaultValue, itemsMap]);

  const _getOptionLabel = useCallback((option: DropdownItem<T>) => option.label, []);
  const _onChange = useCallback(
    (_event: React.SyntheticEvent, option: DropdownItem<T> | null) => {
      if (isEnum) {
        onChange(option ? (option.value as E[keyof E]) : null);
      } else {
        onChange(option ? option.value : null, option?.object ?? null);
      }
    },
    [isEnum, onChange]
  );

  return (
    <Autocomplete
      clearIcon={hiddenClearIcon ? false : undefined}
      options={items}
      value={selected}
      getOptionLabel={_getOptionLabel}
      onChange={_onChange}
      disabled={disabled}
      loading={loading}
      onOpen={onOpen}
      getOptionDisabled={getOptionDisabled}
      slotProps={{
        listbox: {
          onScroll: handleScroll,
          ref: listboxRef,
        },
      }}
      onInputChange={(_, value, reason) => {
        if (reason === 'input' && typeof onSearch === 'function') {
          handleInputChange(value);
        } else if (reason === 'selectOption' || (reason === 'blur' && typeof onSearch === 'function')) {
          handleInputChange('');
        }

        if (value === '' || value === null) {
          onChange(null, null);
        }
      }}
      renderOption={(props, option) => (
        <li
          {...props}
          key={option.value}
        >
          {option.label}
        </li>
      )}
      noOptionsText="Нет значений"
      sx={{
        [`& .${inputBaseClasses.disabled} .${buttonBaseClasses.root}`]: {
          display: 'none',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          required={required}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress size={20} /> : null}
                  {value && getViewTransition && (
                    <IconButton
                      aria-label="Просмотр"
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();

                        if (getViewTransition instanceof Function) {
                          getViewTransition(value);
                        } else {
                          const url = `${window.location.origin}/${getViewTransition}/${value}`;
                          window.open(url, '_blank');
                        }
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  )}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
    />
  );
};

interface ControlProps<E, T> {
  name: string;
  rules?: ControllerProps['rules'];
  onChange?: (field: ControllerRenderProps, newValue: E[keyof E] | string | null, option?: T | null) => void;
}

type ControlDropdownProps<E extends Record<string, string>, T extends { id: string }> = ControlProps<E, T> &
  (Omit<DropdownEnumProps<E>, 'value' | 'onChange'> | Omit<DropdownArrayProps<T>, 'value' | 'onChange'>);

const ControlDropdown = <E extends Record<string, string>, T extends { id: string }>({
  name,
  rules,
  disabled,
  onChange,
  ...props
}: ControlDropdownProps<E, T>) => {
  const { control } = useFormContext();
  const { disabled: formDisabled } = useFormDisabled();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (newValue: E[keyof E] | string | null, option?: T | null) => {
          if (!onChange) {
            field.onChange(newValue);
            return;
          }

          if (option) {
            onChange(field, newValue, option);
          } else {
            onChange(field, newValue);
          }
        };

        return (
          <Dropdown
            {...field}
            {...props}
            disabled={disabled || formDisabled}
            onChange={handleChange}
            error={!!error}
            helperText={error?.message}
          />
        );
      }}
    />
  );
};

export default ControlDropdown;
