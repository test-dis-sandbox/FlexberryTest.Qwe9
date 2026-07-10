'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Column } from 'primereact/column';
import {
  DataTableSortMeta,
  DataTableFilterMeta,
  DataTableValue,
  DataTable as PrimeDataTable,
  DataTableFilterMetaData,
  DataTableStateEvent,
} from 'primereact/datatable';
import { usePathname, useRouter } from 'next/navigation';
import { Typography, Box, Stack, Button, Tooltip } from '@mui/material';
import { CheckBoxOutlined } from '@mui/icons-material';
import { MultiSelect } from 'primereact/multiselect';
import { Checkbox } from 'primereact/checkbox';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import ConfirmationDialog from '@/components/ConfirmationDialog';
import {
  DataTablePaginator,
  CurrentPageReportTemplate,
  rowsPerPageOptionsDefault,
} from '@/components/DataTablePaginator';
import ClampedTextTooltip from '@/components/ClampedTextTooltip';
import { useNotification } from '@/components/Notification';
import { SearchColumnsParam } from '@/types/helpers/SearchColumnsParam';
import { formatDate } from '@/utils/dateUtils';
import { debounce } from '@/utils/debounce';

import ColumnFilter from './ColumnFilter';
import DataTableToolbar from './DataTableToolbar';
import useCellSelection from './useCellSelection';
import './style.scss';
import { TableStyles } from './styles';

/**
 * Конфигурация колонки таблицы.
 * @typedef {Object} FieldDefinition
 * @property {string} field - Ключ поля в объекте данных.
 * @property {string} title - Заголовок столбца (отображается в UI).
 * @property {string} [width] - Ширина столбца (опционально).
 */
export interface FieldDefinition<T = unknown> {
  field: T extends unknown ? (T extends object ? Extract<keyof T, string> : string) : string;
  title: string;
  filter?: boolean;
  width?: string;
  hidden?: boolean;
  selected?: boolean;
  type?: 'text' | 'date' | 'datetime' | 'boolean' | 'enum' | 'number';
  options?: Record<string, string>;

  /**
   * Флаг подсветки пустых значений.
   */
  highlightEmpty?: boolean;

  /**
   * Получить переданный компонент для ячейки столбца.
   */
  getComponent?: (data: string | number | boolean | null | undefined) => React.ReactNode;
}

/**
 * Пропсы для компонента DataTable.
 * @template T
 * @typedef {Object} DataTableProps
 * @property {T[]} data - Данные, отображаемые в таблице.
 * @property {FieldDefinition[]} fields - Конфигурация столбцов.
 * @property {DataTableFilterMeta} filters - Примененные в колонках таблицы фильтры.
 * @property {(value: DataTableFilterMeta | undefined) => void} setFilters - Метод изменения фильтров.
 * @property {DataTableSortMeta[]} multiSortMeta - Текущая сортировка таблицы.
 * @property {React.Dispatch<React.SetStateAction<DataTableSortMeta[]>>} setSorting - Метод изменения сортировки таблицы.
 * @property {string} title - Заголовок таблицы.
 * @property {string} subTitle - Подзаголовок таблицы.
 * @property {(items: T[]) => Promise<boolean>} beforeDelete - Хук, вызываемый перед удалением. Если возвращается false, то удаление отменяется.
 * @property {(index: number) => void} onDelete - Обработчик удаления строки по индексу.
 * @property {(item: T) => void} onRowClick - Обработчик клика по строке.
 * @property {() => void} onCreateButtonClick - Обработчик нажатия кнопки "Создать".
 * @property {React.ReactNode} beforeColumnContent - Разметка колонок, для вставки в начало таблицы.
 * @property {number} totalRecords - Общее число записей.
 * @property {number} rowsPerPage - Записей на странице.
 * @property {React.Dispatch<React.SetStateAction<number>>} setPerPage - Метод изменения кол-ва записей на странице.
 * @property {React.Dispatch<React.SetStateAction<number>>} setPage - Метод установки текущей страницы (начинается с 0).
 * @property {boolean} onEditForm - Находится ли таблица на форме редактирования.
 * @property {number[]} rowsPerPageOptions - Возможные варианты выбора кол-ва записей на странице.
 * @property {boolean} selected - Возможность выбора строк.
 * @property {string} createButtonCaption - Текст кнопки создания.
 * @property {string} removeButtonCaption - Текст кнопки удаления.
 * @property {boolean} showExportButton - Видимость кнопки экспорта.
 * @property {boolean} showRemoveButton - Видимость кнопки удаления.
 * @property {boolean} showCreateButton - Видимость кнопки создания.
 * @property {boolean} showSettingsButton - Видимость кнопки настроек.
 * @property {boolean} lazyLoad - "Ленивая" загрузка данных (пагинация, сортировка и фильтрация берут данные с бекенда).
 */
interface DataTableProps<T> {
  data: T[];
  fields: FieldDefinition<T>[];
  filters?: DataTableFilterMeta;
  setFilters?: (value: DataTableFilterMeta | undefined) => void;
  setGlobalFilter?: (value: SearchColumnsParam | undefined) => void;
  multiSortMeta?: DataTableSortMeta[];
  setSorting?: (columns: DataTableSortMeta[]) => void;
  title?: string;
  subTitle?: string;
  beforeDelete?: (items: T[]) => Promise<boolean>;
  onDelete?: (items: T[]) => void;
  onRowClick?: (item: T) => void;
  onCreateButtonClick?: () => void;
  shouldSelectCell?: (rowData: T, field: string) => boolean;
  onSelectionChange?: (selected: Record<number, Set<string>>) => void;
  beforeColumnContent?: React.ReactNode;
  totalRecords?: number;
  rowsPerPage?: number;
  setPerPage?: (value: number) => void;
  page?: number;
  setPage?: (page: number, perPage: number) => void;
  onEditForm?: boolean;
  rowsPerPageOptions?: number[];
  selected?: boolean;
  createButtonCaption?: string;
  createButtonDisabledTooltip?: string;
  createButtonDisabled?: boolean;
  removeButtonCaption?: string;
  showPaginator?: boolean;
  showExportButton?: boolean;
  showRemoveButton?: boolean;
  showCreateButton?: boolean;
  showSettingsButton?: boolean;
  deleteConfirmation?: boolean;
  lazyLoad?: boolean;
  onSelectRows?: (rows: T[]) => void;
  onChangeVisibleColumns?: (columns: string[]) => void;
  onColumnResize?: (field: string | undefined, width: number) => void;
  onColumnReorder?: (fields: FieldDefinition<T>[]) => void;
  showResetButton?: boolean;
  onResetSettingsClick?: () => void;
  isLoading?: boolean;
  onExportClick?: (visibleColumns: string[]) => Promise<void>;
}

/**
 * Компонент многофункциональной таблицы данных с возможностью поиска, пагинации,
 * выбора столбцов, сортировки и форматирования дат.
 *
 * @template T - Тип отображаемых объектов данных.
 * @param {DataTableProps<T>} props - Пропсы компонента.
 * @returns {JSX.Element} JSX-элемент таблицы.
 */
const DataTable = <T extends DataTableValue>({
  data,
  fields,
  filters,
  setFilters,
  setGlobalFilter,
  title,
  multiSortMeta,
  setSorting,
  beforeDelete,
  onDelete,
  onRowClick,
  onCreateButtonClick,
  shouldSelectCell = () => true,
  onSelectionChange,
  onEditForm = false,
  selected = true,
  subTitle,
  beforeColumnContent,
  totalRecords = 0,
  rowsPerPage = 10,
  setPerPage,
  page = 0,
  setPage,
  rowsPerPageOptions = rowsPerPageOptionsDefault,
  createButtonCaption,
  createButtonDisabled,
  createButtonDisabledTooltip,
  removeButtonCaption,
  showPaginator = true,
  showExportButton,
  showRemoveButton,
  showCreateButton,
  showSettingsButton,
  deleteConfirmation = true,
  lazyLoad = false,
  onSelectRows,
  onChangeVisibleColumns,
  onColumnResize,
  onColumnReorder,
  showResetButton,
  onResetSettingsClick,
  isLoading,
  onExportClick,
}: DataTableProps<T>) => {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(fields.map((x) => x.field));
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<DataTableValue[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [customFilters, setCustomFilters] = useState<DataTableFilterMeta>({});

  const { selectedCells, isSelected, toggleCell, clearSelection } = useCellSelection();
  const selectedFields = useMemo(() => fields.filter((f) => f.selected).map((f) => f.field), [fields]);

  const [tableKey, setTableKey] = useState(0);

  const [{ page: internalPage, perPage: internalPerPage }, setInternalPage] = useState({ page, perPage: rowsPerPage });

  const currentPage = typeof setPage === 'function' ? page : internalPage;
  const currentPerPage = typeof setPage === 'function' ? rowsPerPage : internalPerPage;

  const first = useMemo(() => currentPage * currentPerPage, [currentPage, currentPerPage]);

  useEffect(() => {
    if (typeof filters !== 'undefined') {
      setCustomFilters(filters);
    }
  }, [filters]);

  useEffect(() => {
    setVisibleColumns(fields.filter((f) => !f.hidden).map((f) => f.field));
  }, [fields]);

  useEffect(() => {
    if (typeof onSelectRows === 'function') {
      onSelectRows(selectedRows as T[]);
    }
  }, [onSelectRows, selectedRows]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedCells);
    }
  }, [onSelectionChange, selectedCells]);

  useEffect(() => {
    const handleClickOutsideFilter = (event: MouseEvent) => {
      const target = event.target as Node;

      const isClickInsideOverlay = Array.from(
        document.querySelectorAll('.p-column-filter-overlay, .p-column-filter-overlay-menu')
      ).some((overlay) => overlay.contains(target));

      const isMuiMenuClick = (target as Element)?.closest('[role="presentation"], [role="dialog"]');

      if (!isClickInsideOverlay && !isMuiMenuClick) {
        document
          .querySelectorAll('.p-column-filter [aria-label="Hide Filter Menu"]')
          .forEach((btn) => (btn as HTMLElement).click());
      }
    };

    document.addEventListener('mousedown', handleClickOutsideFilter);

    return () => document.removeEventListener('mousedown', handleClickOutsideFilter);
  }, []);

  const handleExportClick = useCallback(async () => {
    if (!onExportClick) {
      return;
    }

    setIsExporting(true);
    try {
      await onExportClick(visibleColumns);
    } finally {
      setIsExporting(false);
    }
  }, [onExportClick, visibleColumns]);

  const handleSort = useCallback(
    (e: DataTableStateEvent) => {
      if (typeof setSorting === 'function') {
        setSorting(e.multiSortMeta ?? []);
      }
    },
    [setSorting]
  );

  const handleRowClick = useCallback(
    (item: T) => {
      if (onRowClick) {
        return onRowClick(item);
      }

      if (item && 'id' in item) {
        router.push(`${pathname}/${item.id}`);
      }
    },
    [onRowClick, pathname, router]
  );

  const handleCreateButtonClick = useCallback(() => {
    if (onCreateButtonClick) {
      return onCreateButtonClick();
    }

    router.push(`${pathname}/new`);
  }, [onCreateButtonClick, pathname, router]);

  const handleBeforeDelete = async () => {
    let actualDelete = true;
    if (selectedRows.length > 0 && beforeDelete) {
      actualDelete = await beforeDelete(selectedRows as T[]);
    }

    if (actualDelete) {
      if (deleteConfirmation) {
        setOpen(true);
      } else {
        handleDeleteButtonClick();
      }
    }
  };

  const handleDeleteButtonClick = () => {
    if (selectedRows.length > 0 && onDelete) {
      onDelete(selectedRows as T[]);
      clearSelection(selectedRows.map((sr) => sr.id));
      setSelectedRows([]);
    }
  };

  const handleSelectionChange = (selected: DataTableValue[]) => {
    setSelectedRows(selected);

    selected.forEach((row) => {
      const fieldsToSelect = selectedFields.filter((field) => shouldSelectCell(row as T, field));

      fieldsToSelect.forEach((field) => {
        if (!isSelected(row.id, field)) {
          toggleCell(row.id, field);
        }
      });
    });
  };

  const handleGlobalFilterChange = (globalFilter: string) => {
    if (setGlobalFilter) {
      if (!globalFilter || visibleColumns.length === 0) {
        setGlobalFilter(undefined);

        return;
      }

      setGlobalFilter({
        searchColumns: visibleColumns
          .filter((v) => {
            const field = fields.find((f) => f.field === v);

            return field?.type === 'text' || field?.type === 'enum';
          })
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join(','),
        searchColumnsEq: visibleColumns
          .filter((v) => {
            const field = fields.find((f) => f.field === v);

            return field?.type === 'number';
          })
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join(','),
        searchColumnsDate: visibleColumns
          .filter((v) => {
            const field = fields.find((f) => f.field === v);

            return field?.type === 'date';
          })
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join(','),
        searchColumnsDateTime: visibleColumns
          .filter((v) => {
            const field = fields.find((f) => f.field === v);

            return field?.type === 'datetime';
          })
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join(','),
        searchText: globalFilter,
      });
    }
  };

  const lastVisibleColumn = visibleColumns[visibleColumns.length - 1];

  const renderCellContent = useCallback(
    (rowData: T, column: FieldDefinition<T>) => {
      let value = getValueByPath(rowData, column.field);

      if (typeof column.getComponent === 'function') {
        return column.getComponent(value);
      }

      if (value === undefined || value === null || value === false) {
        return <span className={column.highlightEmpty ? 'p-highlight-empty' : ''}></span>;
      }

      if (typeof value === 'boolean') {
        return <CheckBoxOutlined sx={{ color: '#16A086' }} />;
      }

      if (typeof value !== 'number') {
        value = formatDate(value);
      }

      if (column.selected && !!value) {
        return (
          <Stack
            direction="row"
            alignItems="center"
          >
            <Checkbox
              checked={isSelected(rowData.id, column.field)}
              onChange={() => toggleCell(rowData.id, column.field)}
            />
            <ClampedTextTooltip
              title={value}
              cellLineClamp={3}
            />
          </Stack>
        );
      }

      return (
        <ClampedTextTooltip
          title={value}
          cellLineClamp={3}
        />
      );
    },
    [isSelected, toggleCell]
  );

  const [containerWidth, setContainerWidth] = useState(0);
  const ref = useRef<PrimeDataTable<DataTableValue[]> | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      const element = ref.current?.getElement();
      if (element) {
        setContainerWidth(element.offsetWidth);
      }
    };
    const debouncedUpdateWidth = debounce(updateWidth, 200);

    updateWidth();
    window.addEventListener('resize', debouncedUpdateWidth);

    return () => {
      window.removeEventListener('resize', debouncedUpdateWidth);
    };
  }, []);

  const visibleFieldDefs = useMemo(
    () => fields.filter((col) => visibleColumns.includes(col.field)),
    [fields, visibleColumns]
  );

  const totalColumnsWidth = useMemo(
    () => visibleFieldDefs.reduce((acc, col) => acc + (col.width ? parseInt(col.width, 10) : 0), 0),
    [visibleFieldDefs]
  );

  const isNotOverflow = totalColumnsWidth <= containerWidth;
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const { showSuccess } = useNotification();
  const rowHeight = 45;
  const tableHeight = currentPerPage * rowHeight;
  const loadingHeight = isLoading ? tableHeight : undefined;

  useEffect(() => {
    const updateOverlayHeight = () => {
      const tableEl = ref.current?.getElement();
      const overlay = tableEl?.querySelector<HTMLDivElement>('.p-datatable-loading-overlay');
      if (overlay) {
        overlay.style.maxHeight = loadingHeight ? `${loadingHeight}px` : 'auto';
      }
    };

    updateOverlayHeight();
  }, [loadingHeight, data, isLoading]);

  return (
    <>
      <Typography
        variant="h1"
        component="h2"
      >
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={(theme) => ({ color: theme.palette.text.secondary })}
      >
        {subTitle}
      </Typography>

      <DataTableToolbar
        countSelectedRows={selectedRows.length}
        onCreateButtonClick={handleCreateButtonClick}
        onRemoveButtonClick={handleBeforeDelete}
        onSettingsClick={() => setIsSettingsOpen((prev) => !prev)}
        selected={selected}
        createButtonCaption={createButtonCaption}
        createButtonDisabled={createButtonDisabled}
        createButtonDisabledTooltip={createButtonDisabledTooltip}
        removeButtonCaption={removeButtonCaption}
        onExportClick={handleExportClick}
        isExporting={isExporting}
        showExportButton={showExportButton}
        showRemoveButton={showRemoveButton}
        showCreateButton={showCreateButton}
        showSettingsButton={showSettingsButton}
        onEditForm={onEditForm}
        onGlobalFilterChange={handleGlobalFilterChange}
      />

      {isSettingsOpen && (
        <Box sx={{ mb: 2, display: 'flex', gap: '1rem' }}>
          <MultiSelect
            value={visibleColumns}
            options={fields.map((col) => ({ label: col.title, value: col.field }))}
            onChange={(e) => {
              setVisibleColumns(e.value);
              if (typeof onChangeVisibleColumns === 'function') {
                onChangeVisibleColumns(e.value);
              }
            }}
            display="chip"
            placeholder="Показать / Скрыть столбцы"
            style={{ maxWidth: '80%' }}
          />

          {showResetButton && onResetSettingsClick && (
            <>
              <Tooltip title="Сброс настроек">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsResetDialogOpen(true)}
                >
                  Сброс
                </Button>
              </Tooltip>
              <ConfirmationDialog
                open={isResetDialogOpen}
                setOpen={setIsResetDialogOpen}
                title="Предупреждение"
                description="Вы уверены, что хотите сбросить настройки отображения?"
                captionAgree="Да"
                captionDisagree="Отмена"
                handleAgree={async () => {
                  await onResetSettingsClick();
                  setTableKey((prev) => prev + 1);
                  showSuccess('Настройки успешно сброшены.');
                }}
              />
            </>
          )}
        </Box>
      )}
      <TableStyles />
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ru"
      >
        <PrimeDataTable
          key={tableKey}
          className={onEditForm ? 'on-edit-form' : ''}
          value={data}
          loading={isLoading}
          ref={ref}
          paginator={showPaginator}
          lazy={lazyLoad}
          totalRecords={totalRecords}
          first={first}
          rows={typeof setPage === 'function' ? currentPerPage : internalPerPage}
          onPage={(e) => {
            const page: number = e.page || 0;

            if (setPage) {
              setPage(page, e.rows);
            } else {
              setInternalPage({ page, perPage: e.rows });
            }
          }}
          onColumnResizeEnd={(e) => {
            if (typeof onColumnResize === 'function') {
              onColumnResize(e.column.props.field, e.element.offsetWidth);
            }
          }}
          onRowClick={(e) => handleRowClick(e.data as T)}
          resizableColumns
          columnResizeMode="expand"
          scrollable
          sortMode="multiple"
          multiSortMeta={multiSortMeta}
          onSort={handleSort}
          scrollHeight="100%"
          selection={selectedRows}
          selectionMode="checkbox"
          onSelectionChange={(e) => handleSelectionChange(e.value)}
          removableSort
          paginatorLeft={<span>Строк на странице</span>}
          reorderableColumns
          onColReorder={(e) => {
            const reordered = [...fields];

            const [moved] = reordered.splice(e.dragIndex - 1, 1);
            reordered.splice(e.dropIndex - 1, 0, moved);

            if (typeof onColumnReorder === 'function') {
              onColumnReorder(reordered);
            }
          }}
          paginatorTemplate={DataTablePaginator(
            rowsPerPageOptions.includes(currentPerPage)
              ? rowsPerPageOptions
              : [...rowsPerPageOptions, currentPerPage].sort((a, b) => a - b)
          )}
          currentPageReportTemplate={CurrentPageReportTemplate}
          cellMemo={false}
        >
          {beforeColumnContent}
          {selected && (
            <Column
              columnKey="checkbox"
              selectionMode="multiple"
            />
          )}
          {fields
            .filter((col) => visibleColumns.includes(col.field))
            .map((col) => {
              const isFilterActive = (field: string) => {
                if (typeof customFilters === 'undefined') {
                  return false;
                }

                const filter = customFilters[field] || filters?.[field];

                if (!filter) {
                  return false;
                }

                if ('value' in filter) {
                  const value = filter.value;

                  if (Array.isArray(value)) {
                    return value.length > 0;
                  }

                  return value !== null && value !== '';
                }

                return false;
              };

              const isLast = col.field === lastVisibleColumn;

              return (
                <Column
                  key={col.field}
                  field={col.field}
                  header={col.title}
                  filter={col.filter}
                  sortable
                  headerClassName={isFilterActive(col.field) ? 'filter-active-header' : ''}
                  filterApply={(options) => (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ m: 1 }}
                      onClick={() => {
                        if (typeof customFilters !== 'undefined' && typeof setFilters === 'function') {
                          setFilters({ ...filters, [col.field]: customFilters[col.field] });
                        }

                        options.filterApplyCallback();
                      }}
                    >
                      Применить
                    </Button>
                  )}
                  filterClear={(options) => (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ m: 1 }}
                      onClick={() => {
                        if (typeof setFilters === 'function') {
                          const newFilters = { ...filters };
                          delete newFilters[col.field];
                          setFilters(newFilters);
                        }

                        options.filterClearCallback();
                      }}
                    >
                      Очистить
                    </Button>
                  )}
                  showFilterOperator={false}
                  showFilterMenuOptions={false}
                  style={isLast && isNotOverflow ? {} : { width: col.width }}
                  body={(rowData) => renderCellContent(rowData, col)}
                  filterElement={
                    <ColumnFilter
                      type={col.type ?? 'text'}
                      placeholder={col.title}
                      value={customFilters?.[col.field] as DataTableFilterMetaData | undefined}
                      onChange={(value) => {
                        setCustomFilters((prev) => ({ ...prev, [col.field]: value }));
                      }}
                      options={col.options}
                    />
                  }
                />
              );
            })}
        </PrimeDataTable>
      </LocalizationProvider>
      {deleteConfirmation && (
        <ConfirmationDialog
          open={open}
          setOpen={setOpen}
          handleAgree={handleDeleteButtonClick}
          description={`Вы действительно хотите удалить выделенные элементы? Выделено ${selectedRows.length}. Это действие невозможно отменить.`}
        />
      )}
    </>
  );
};

/**
 * Получить данные для ячейки из строки данных таблицы.
 * Можно указывать путь до вложенных свойств.
 * @param obj Строка.
 * @param path Путь до поля. @example "title", "items.label"
 * @returns Данные.
 */
function getValueByPath<T>(obj: T, path: string): string | boolean | number | null | undefined {
  const keys = path.split('.');
  let acc: unknown = obj;

  for (const key of keys) {
    if (acc === null || acc === undefined) {
      return null;
    }

    // Если текущий аккумулятор — массив.
    if (Array.isArray(acc)) {
      // Поддержим числовой индекс в пути: "data.0.items".
      if (/^\d+$/.test(key)) {
        acc = acc[Number(key)];
      } else {
        // Берём поле у каждого элемента и расплющиваем на один уровень.
        acc = acc.flatMap((item) => (item === null ? [] : item[key]));
      }
    } else {
      acc = (acc as Record<string, object | number | null | undefined | string | undefined | boolean>)[key];
    }
  }

  // Если на выходе массив — сведём его к строке через запятую.
  if (Array.isArray(acc)) {
    // Полезно убрать пустые и расплющить вдруг оставшиеся вложенности
    const flat = acc.flat(Infinity).filter((v) => v !== null);

    // Если всё ещё объекты — отдавать "[object Object]" нельзя.
    // Оставим только примитивы и Date, остальное отбросим.
    const printable = flat.filter((v) => typeof v !== 'object' || v instanceof Date);

    return printable.map(String).join(', ');
  }

  // Не отдаём "сырой" объект в ячейку.
  if (typeof acc === 'object' && !(acc instanceof Date)) {
    return null;
  }

  return acc as string | boolean | number | null | undefined;
}

export default DataTable;
