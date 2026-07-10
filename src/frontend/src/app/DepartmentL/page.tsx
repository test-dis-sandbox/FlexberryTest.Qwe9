'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllDepartment from '@/hooks/Department/useGetAllDepartment';
import useDeleteAllDepartment from '@/hooks/Department/useDeleteAllDepartment';
import { tDirection } from '@/enums/tDirection.types';
import { tView } from '@/enums/tView.types';
import { IDepartmentL } from '@/types/Department.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function DepartmentPageList() {
  const viewName: string = 'DepartmentL';

  const {
    resetAll,
    isReady,
    applyFieldSettings,
    handleRowClickWithState,
    handleCreateButtonWithState,
    updateSettings: {
      updatePerPage,
      updateSorting,
      updateVisibleColumns,
      updateColumnResize,
      updateColumnReorder,
      updateFilter,
    },
    params: { page, perPage, sorting, filter, search, setSearch },
  } = useListState<IDepartmentL>('DepartmentPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllDepartment<IDepartmentL>({
    viewName,
    perPage,
    page,
    sorting,
    filter,
    search,
    enabled: isReady,
  });

  const handleSuccess = () => {
    showSuccess(`Запись удалена.`);
  };

  const handleError = (error: Error) => {
    showError(`Ошибка при удалении настройки: ${formatError(error)}.`);
  };

  const { deleteAllDepartment } = useDeleteAllDepartment(handleSuccess, handleError);

  const handleDelete = (items: IDepartmentL[]) => {
    deleteAllDepartment(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.DepartmentL,
    fileName: 'DepartmentL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'name',
      title: 'Название',
      filter: true,
      type: 'text',
    },
    {
      field: 'foundationDate',
      title: 'Дата основания',
      filter: true,
      type: 'date',
    },
    {
      field: 'hasAdditionalEducation',
      title: 'Наличие дополнительного образования',
      filter: true,
      type: 'boolean',
    },
    {
      field: 'specialization',
      title: 'Специализация',
      filter: true,
      type: 'enum',
      options: tDirection,
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Кафедра"
        onRowClick={(item) => handleRowClickWithState(item)}
        onCreateButtonClick={() => handleCreateButtonWithState()}
        onDelete={handleDelete}
        filters={filter}
        setFilters={(v) => updateFilter(v)}
        setGlobalFilter={setSearch}
        totalRecords={count}
        rowsPerPage={perPage}
        page={page}
        setPage={(page, perPage) => updatePerPage(page, perPage)}
        multiSortMeta={sorting}
        setSorting={(columns) => updateSorting(columns)}
        lazyLoad={true}
        onChangeVisibleColumns={(columns) => updateVisibleColumns(fields, columns)}
        onColumnResize={(field, width) => updateColumnResize(field, width)}
        onColumnReorder={(fields) => updateColumnReorder(fields)}
        showResetButton={true}
        onResetSettingsClick={resetAll}
        onExportClick={exportList}
        isLoading={isLoading}
      />
    </Box>
  );
}
