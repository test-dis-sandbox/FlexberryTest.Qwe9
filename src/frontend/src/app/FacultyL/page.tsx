'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllFaculty from '@/hooks/Faculty/useGetAllFaculty';
import useDeleteAllFaculty from '@/hooks/Faculty/useDeleteAllFaculty';
import { tFacultyType } from '@/enums/tFacultyType.types';
import { tView } from '@/enums/tView.types';
import { IFacultyL } from '@/types/Faculty.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function FacultyPageList() {
  const viewName: string = 'FacultyL';

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
  } = useListState<IFacultyL>('FacultyPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllFaculty<IFacultyL>({
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

  const { deleteAllFaculty } = useDeleteAllFaculty(handleSuccess, handleError);

  const handleDelete = (items: IFacultyL[]) => {
    deleteAllFaculty(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.FacultyL,
    fileName: 'FacultyL',
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
      field: 'hasMilitaryDepartment',
      title: 'Наличие военной кафедры',
      filter: true,
      type: 'boolean',
    },
    {
      field: 'type',
      title: 'Профиль факультета',
      filter: true,
      type: 'enum',
      options: tFacultyType,
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Факультет"
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
