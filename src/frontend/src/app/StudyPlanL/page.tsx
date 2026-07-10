'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllStudyPlan from '@/hooks/StudyPlan/useGetAllStudyPlan';
import useDeleteAllStudyPlan from '@/hooks/StudyPlan/useDeleteAllStudyPlan';
import { tView } from '@/enums/tView.types';
import { IStudyPlanL } from '@/types/StudyPlan.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function StudyPlanPageList() {
  const viewName: string = 'StudyPlanL';

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
  } = useListState<IStudyPlanL>('StudyPlanPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllStudyPlan<IStudyPlanL>({
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

  const { deleteAllStudyPlan } = useDeleteAllStudyPlan(handleSuccess, handleError);

  const handleDelete = (items: IStudyPlanL[]) => {
    deleteAllStudyPlan(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.StudyPlanL,
    fileName: 'StudyPlanL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'creationDate',
      title: 'Дата создания',
      filter: true,
      type: 'date',
    },
    {
      field: 'hasPractice',
      title: 'Наличие практики',
      filter: true,
      type: 'boolean',
    },
    {
      field: 'specialization',
      title: 'Специализация',
      filter: true,
      type: 'text',
    },
    {
      field: 'totalHours',
      title: 'Количество часов',
      filter: true,
      type: 'number',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Учебный план"
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
