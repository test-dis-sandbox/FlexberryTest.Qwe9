'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import { ControllerProps, ControllerRenderProps } from 'react-hook-form';
import { DataTableValue, DataTable as PrimeDataTable } from 'primereact/datatable';
import { InputLabel } from '@mui/material';

import ControlFilePicker from '@/components/FilePicker';
import ControlTextField from '@/components/TextField';
import ControlDatePicker from '@/components/DatePicker';
import ControlCheckbox from '@/components/Checkbox';
import ControlDropdown, { DropdownItem } from '@/components/DropDown';
import { DateOnly } from '@/utils/dateUtils';

import DataTableEditorToolbar from './DataTableEditorToolbar';
import { TableStyles } from './styles';
import '../DataTable/style.scss';
import { useFormDisabled } from '../DisabledFormProvider';

export type OptionsEnum = Record<string, string>;
export type OptionsArray = { id: string };
export type FieldValueEditor = string | number | Date | DateOnly | boolean | NonEmptyString | WebFile | null;

export interface ControlColumnEditor<T, E extends OptionsEnum, A extends OptionsArray> {
  field: keyof T | 'button';
  title?: string;
  editor?: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'file';
  options?: E | A[];
  getOptionLabel?: (option: A) => string;
  defaultValue?: (option: T) => string | null;
  getOptionDisabled?: (option: DropdownItem<A>) => boolean;
  getViewTransition?: ((value: string) => void) | string;
  onChange?: (field: ControllerRenderProps, newValue: FieldValueEditor, rowIndex: number, option?: A) => void;
  getOptions?: (row: T, rowIndex: number) => A[];
  required?: boolean;
  readonly?: boolean;
  sortable?: boolean;
  multiline?: boolean;
  minDate?: Date;
  maxDate?: Date;
  rules?: ControllerProps['rules'] | ((rowIndex: number) => ControllerProps['rules']);
  width?: string;
  /** Максимальный размер файла в мегабайтах. */
  maxSizeMB?: number;

  /** Массив строк с разрешенными расширениями файлов (например, ['.jpg', '.png']). */
  accept?: string[];

  /**
   * Получить переданный компонент для ячейки столбца.
   */
  getComponent?: (data: T) => ReactNode;
}

interface ControlDataTableEditorProps<T extends object, E extends OptionsEnum, A extends OptionsArray> {
  data: T[];
  name: string;
  columns: ControlColumnEditor<T, E, A>[];
  onCreate?: () => void;
  onDelete?: (selectedIds: string[]) => void;

  /**
   * Колбэк для обновления перетащенной строки.
   * @param dragIndex Индекс, где была строка.
   * @param dropIndex Индекс, куда вставляется строка.
   */
  onRowReorder?: (dragIndex: number, dropIndex: number) => void;

  /**
   * Колбэк, который вызывается после того, как порядок строк изменился.
   */
  onRowReordered?: () => void;

  /**
   * Колбэк для опеределения добавленных строк, для их подсветки.
   * @param data Данные строки.
   * @returns {boolean}
   */
  isAddedRow?: (data: T) => boolean;

  onRowClick?: (data: T) => void;
}

const ControlDataTableEditor = <T extends DataTableValue, E extends OptionsEnum, A extends OptionsArray>({
  data,
  name,
  columns,
  onCreate,
  onDelete,
  onRowReorder,
  onRowReordered,
  isAddedRow,
  onRowClick,
}: ControlDataTableEditorProps<T, E, A>) => {
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const { disabled: formDisabled } = useFormDisabled();

  useEffect(() => {
    setSelectedRows((prev) => prev.filter((sel) => data.some((r) => r.id === sel.id)));
  }, [data]);

  useEffect(() => {
    if (typeof onRowReordered === 'function' && data) {
      onRowReordered();
    }
  }, [data, onRowReordered]);

  const handleAddRow = () => {
    if (typeof onCreate === 'function') {
      onCreate();
    }
  };

  const handleDeleteRows = () => {
    if (typeof onDelete === 'function') {
      onDelete(selectedRows.map((r) => r.id));
      setSelectedRows([]);
    }
  };

  const textEditor = (
    rowIndex: number,
    id: NonEmptyString,
    column: ControlColumnEditor<T, E, A>,
    rules: ControllerProps['rules']
  ) => (
    <ControlTextField
      key={id}
      name={`${name}.${rowIndex}.${String(column.field)}`}
      rules={rules}
      type="text"
      disabled={column.readonly}
      onChange={(field, newValue) => {
        if (column.onChange) {
          column.onChange(field, newValue, rowIndex);
        } else {
          field.onChange(newValue);
        }
      }}
    />
  );

  const numberEditor = (
    rowIndex: number,
    id: NonEmptyString,
    column: ControlColumnEditor<T, E, A>,
    rules: ControllerProps['rules']
  ) => (
    <ControlTextField
      key={id}
      name={`${name}.${rowIndex}.${String(column.field)}`}
      rules={rules}
      type="number"
      disabled={column.readonly}
      onChange={(field, newValue) => {
        if (column.onChange) {
          column.onChange(field, newValue, rowIndex);
        } else {
          field.onChange(newValue);
        }
      }}
    />
  );

  const dateEditor = (
    rowIndex: number,
    id: NonEmptyString,
    column: ControlColumnEditor<T, E, A>,
    rules: ControllerProps['rules']
  ) => (
    <ControlDatePicker
      key={id}
      name={`${name}.${rowIndex}.${String(column.field)}`}
      rules={rules}
      disabled={column.readonly}
      minDate={column.minDate}
      maxDate={column.maxDate}
      onChange={(field, newValue) => {
        if (column.onChange) {
          column.onChange(field, newValue, rowIndex);
        } else {
          field.onChange(newValue);
        }
      }}
    />
  );

  const checkboxEditor = (
    rowIndex: number,
    id: NonEmptyString,
    column: ControlColumnEditor<T, E, A>,
    rules: ControllerProps['rules']
  ) => (
    <ControlCheckbox
      key={id}
      name={`${name}.${rowIndex}.${String(column.field)}`}
      rules={rules}
      disabled={column.readonly}
      onChange={(field, newValue) => {
        if (column.onChange) {
          column.onChange(field, newValue, rowIndex);
        } else {
          field.onChange(newValue);
        }
      }}
    />
  );

  const dropdownEditor = (
    rowIndex: number,
    id: NonEmptyString,
    column: ControlColumnEditor<T, E, A>,
    rules: ControllerProps['rules']
  ) => {
    if (!column.options && !column.getOptions) {
      return null;
    }

    const resolvedOptions = column.getOptions ? column.getOptions(data[rowIndex], rowIndex) : column.options;
    if (!resolvedOptions) {
      return null;
    }

    const defaultValue = column.defaultValue ? (column.defaultValue(data[rowIndex]) ?? undefined) : undefined;

    if (Array.isArray(resolvedOptions)) {
      if (!column.getOptionLabel) {
        return;
      }

      return (
        <ControlDropdown
          key={id}
          name={`${name}.${rowIndex}.${String(column.field)}`}
          rules={rules}
          disabled={column.readonly}
          options={resolvedOptions}
          getOptionLabel={column.getOptionLabel}
          defaultValue={defaultValue}
          getOptionDisabled={column.getOptionDisabled}
          getViewTransition={column.getViewTransition}
          onChange={(field, newValue, option) => {
            if (column.onChange) {
              column.onChange(field, newValue, rowIndex, option!);
            } else {
              field.onChange(newValue);
            }
          }}
        />
      );
    } else {
      return (
        <ControlDropdown
          key={id}
          name={`${name}.${rowIndex}.${String(column.field)}`}
          rules={rules}
          disabled={column.readonly}
          options={resolvedOptions}
          onChange={(field, newValue) => {
            if (column.onChange) {
              column.onChange(field, newValue, rowIndex);
            } else {
              field.onChange(newValue);
            }
          }}
        />
      );
    }
  };

  const fileEditor = (
    rowIndex: number,
    id: NonEmptyString,
    column: ControlColumnEditor<T, E, A>,
    rules: ControllerProps['rules']
  ) => {
    return (
      <ControlFilePicker
        key={id}
        name={`${name}.${rowIndex}.${String(column.field)}`}
        rules={rules}
        accept={column.accept}
        disabled={column.readonly}
        maxSizeMB={column.maxSizeMB}
        onChange={(field, newValue) => {
          if (column.onChange) {
            column.onChange(field, newValue, rowIndex);
          } else {
            field.onChange(newValue);
          }
        }}
      />
    );
  };

  return (
    <>
      <DataTableEditorToolbar
        countSelectedRows={selectedRows.length}
        onCreateButtonClick={handleAddRow}
        onDeleteButtonClick={handleDeleteRows}
        hideCreateButton={onCreate === undefined}
        hideDeleteButton={onDelete === undefined}
      />

      <TableStyles />

      <PrimeDataTable
        value={data}
        className="on-edit-form"
        selection={selectedRows}
        selectionMode="checkbox"
        onSelectionChange={(e) => setSelectedRows(e.value)}
        onRowClick={(e) => {
          if (typeof onRowClick === 'function') {
            onRowClick(e.data as T);
          }
        }}
        resizableColumns
        columnResizeMode="fit"
        scrollable
        sortMode="multiple"
        removableSort
        scrollHeight="100%"
        reorderableRows={!formDisabled && typeof onRowReorder === 'function'}
        emptyMessage="Нет данных."
        onRowReorder={(e) => {
          if (typeof onRowReorder === 'function') {
            onRowReorder(e.dragIndex, e.dropIndex);
          }
        }}
        rowClassName={(data) => {
          const classes: string[] = [];
          if (typeof isAddedRow === 'function' && isAddedRow(data)) {
            classes.push('p-highlight-added');
          }

          return classes.join(' ');
        }}
      >
        {!formDisabled && typeof onRowReorder === 'function' && (
          <Column
            rowReorder
            style={{ width: '3rem', verticalAlign: 'bottom' }}
          />
        )}
        <Column selectionMode="multiple" />
        {columns.map((column) => (
          <Column
            key={String(column.field)}
            field={String(column.field)}
            header={<InputLabel required={column.required}>{column.title}</InputLabel>}
            sortable={column.sortable}
            style={column.width ? { width: column.width } : undefined}
            body={(item) => {
              const rowIndex = data.findIndex((r) => r.id === item.id);
              const resolveRules = column.rules instanceof Function ? column.rules(rowIndex) : column.rules;

              if (column.field === 'button' && typeof column.getComponent === 'function') {
                return column.getComponent(data[rowIndex]);
              }

              switch (column.editor) {
                case 'text':
                  return textEditor(rowIndex, item.id, column, resolveRules);
                case 'number':
                  return numberEditor(rowIndex, item.id, column, resolveRules);
                case 'date':
                  return dateEditor(rowIndex, item.id, column, resolveRules);
                case 'checkbox':
                  return checkboxEditor(rowIndex, item.id, column, resolveRules);
                case 'dropdown':
                  return dropdownEditor(rowIndex, item.id, column, resolveRules);
                case 'file':
                  return fileEditor(rowIndex, item.id, column, resolveRules);
                default:
                  return textEditor(rowIndex, item.id, column, resolveRules);
              }
            }}
          />
        ))}
      </PrimeDataTable>
    </>
  );
};

export default ControlDataTableEditor;
