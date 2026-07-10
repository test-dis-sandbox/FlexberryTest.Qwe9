'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllSchedule from '@/hooks/Schedule/useGetAllSchedule';
import useDeleteAllSchedule from '@/hooks/Schedule/useDeleteAllSchedule';
import { tView } from '@/enums/tView.types';
import { IScheduleL } from '@/types/Schedule.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function SchedulePageList() {
  const viewName: string = 'ScheduleL';

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
  } = useListState<IScheduleL>('SchedulePageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllSchedule<IScheduleL>({
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

  const { deleteAllSchedule } = useDeleteAllSchedule(handleSuccess, handleError);

  const handleDelete = (items: IScheduleL[]) => {
    deleteAllSchedule(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.ScheduleL,
    fileName: 'ScheduleL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'year',
      title: 'Год',
      filter: true,
      type: 'number',
    },
    {
      field: 'week',
      title: 'Неделя',
      filter: true,
      type: 'number',
    },
    {
      field: 'day',
      title: 'День',
      filter: true,
      type: 'number',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Расписания"
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
