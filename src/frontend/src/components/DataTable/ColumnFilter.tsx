import React, { useMemo } from 'react';
import { TextField, Stack } from '@mui/material';
import { DataTableFilterMetaData } from 'primereact/datatable';

import { Dropdown } from '@/components/DropDown';
import { DatePicker } from '@/components/DatePicker';
import { DateTimePicker } from '@/components/DateTimePicker';
import { Checkbox } from '@/components/Checkbox';

type ValidMatchMode =
  | 'startsWith'
  | 'contains'
  | 'notContains'
  | 'endsWith'
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'notIn'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'between'
  | 'dateIs'
  | 'dateIsNot'
  | 'dateBefore'
  | 'dateAfter'
  | 'custom';

interface ColumnFilterProps {
  type?: 'text' | 'date' | 'datetime' | 'boolean' | 'enum' | 'number';
  placeholder?: string;
  value: DataTableFilterMetaData | undefined;
  onChange: (value: DataTableFilterMetaData) => void;
  options?: Record<string, string>;
}

const OPERATIONS: Record<string, { label: string; value: ValidMatchMode }[]> = {
  text: [
    { label: 'Равно', value: 'equals' },
    { label: 'Не равно', value: 'notEquals' },
    { label: 'Содержит', value: 'contains' },
    { label: 'Не содержит', value: 'notContains' },
  ],
  number: [
    { label: 'Равно', value: 'equals' },
    { label: 'Не равно', value: 'notEquals' },
    { label: 'Больше', value: 'gt' },
    { label: 'Больше равно', value: 'gte' },
    { label: 'Меньше', value: 'lt' },
    { label: 'Меньше равно', value: 'lte' },
  ],
  enum: [
    { label: 'Равно', value: 'equals' },
    { label: 'Не равно', value: 'notEquals' },
  ],
  date: [
    { label: 'После', value: 'dateAfter' },
    { label: 'До', value: 'dateBefore' },
    { label: 'Равно', value: 'dateIs' },
  ],
  datetime: [
    { label: 'После', value: 'dateAfter' },
    { label: 'До', value: 'dateBefore' },
    { label: 'Равно', value: 'dateIs' },
  ],
};

const ColumnFilter: React.FC<ColumnFilterProps> = ({
  type = 'text',
  placeholder = 'Введите значение',
  value,
  onChange,
  options,
}) => {
  const isBoolean = type === 'boolean';
  const isDate = type === 'date';
  const isDateTime = type === 'datetime';
  const isEnum = type === 'enum';
  const isText = type === 'text';
  const isNumber = type === 'number';

  /**
   * Доступные операции фильтрации для текущего типа данных.
   */
  const operationOptions = useMemo(() => {
    const operations = OPERATIONS[type] || [];

    return Object.fromEntries(operations.map((item) => [item.value, item.label])) as Record<ValidMatchMode, string>;
  }, [type]);

  /**
   * Соответствие между отображаемыми названиями и значениями операций.
   */
  const reverseOperationMap = useMemo(() => {
    const operations = OPERATIONS[type] || [];

    return Object.fromEntries(operations.map((item) => [item.label, item.value])) as Record<string, ValidMatchMode>;
  }, [type]);

  /**
   * Текущее отображаемое название операции.
   */
  const currentOperationLabel = useMemo(() => {
    if (value?.matchMode && operationOptions[value.matchMode]) {
      return operationOptions[value.matchMode];
    }
  }, [value?.matchMode, operationOptions]);

  return (
    <Stack
      spacing={2}
      sx={{ minWidth: 250, p: 1 }}
    >
      {!isBoolean && (
        <Dropdown
          label="Операция"
          value={currentOperationLabel ?? ''}
          onChange={(newOperation: string | null) => {
            const resolveMatchMode = reverseOperationMap?.[newOperation ?? ''];
            onChange({ value: value?.value, matchMode: resolveMatchMode });
          }}
          options={operationOptions}
        />
      )}

      {isBoolean && (
        <Checkbox
          label={placeholder}
          checked={value?.value === true}
          onChange={(newValue) => onChange({ value: newValue, matchMode: 'equals' })}
        />
      )}

      {isText && (
        <TextField
          type="text"
          label={placeholder}
          value={value?.value ?? ''}
          onChange={(e) => onChange({ value: e.target.value, matchMode: value?.matchMode })}
          placeholder={placeholder}
          fullWidth
        />
      )}

      {isNumber && (
        <TextField
          size="small"
          type="number"
          label={placeholder}
          value={value?.value ?? 0}
          onChange={(e) => onChange({ value: e.target.value, matchMode: value?.matchMode })}
          placeholder={placeholder}
          fullWidth
        />
      )}

      {isEnum && (
        <Dropdown
          label={placeholder}
          value={value?.value ?? ''}
          onChange={(newValue: unknown) => onChange({ value: newValue, matchMode: value?.matchMode })}
          options={options!}
        />
      )}

      {isDate && (
        <DatePicker
          label={placeholder}
          value={value?.value}
          onChange={(newValue) => onChange({ value: newValue, matchMode: value?.matchMode })}
        />
      )}

      {isDateTime && (
        <DateTimePicker
          label={placeholder}
          value={value?.value}
          onChange={(newValue) => onChange({ value: newValue, matchMode: value?.matchMode })}
        />
      )}
    </Stack>
  );
};

export default ColumnFilter;
