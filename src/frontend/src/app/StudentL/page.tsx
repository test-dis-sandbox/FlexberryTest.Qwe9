'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllStudent from '@/hooks/Student/useGetAllStudent';
import useDeleteAllStudent from '@/hooks/Student/useDeleteAllStudent';
import { tStudentStatus } from '@/enums/tStudentStatus.types';
import { tView } from '@/enums/tView.types';
import { IStudentL } from '@/types/Student.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function StudentPageList() {
  const viewName: string = 'StudentL';

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
  } = useListState<IStudentL>('StudentPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllStudent<IStudentL>({
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

  const { deleteAllStudent } = useDeleteAllStudent(handleSuccess, handleError);

  const handleDelete = (items: IStudentL[]) => {
    deleteAllStudent(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.StudentL,
    fileName: 'StudentL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'enrollmentDate',
      title: 'Дата зачисления',
      filter: true,
      type: 'date',
    },
    {
      field: 'fullName',
      title: 'ФИО',
      filter: true,
      type: 'text',
    },
    {
      field: 'isBudget',
      title: 'Бюджетная основа',
      filter: true,
      type: 'boolean',
    },
    {
      field: 'status',
      title: 'Статус',
      filter: true,
      type: 'enum',
      options: tStudentStatus,
    },
    {
      field: 'studentId',
      title: 'Номер зачётной книжки ',
      filter: true,
      type: 'text',
    },
    {
      field: 'planHasPractice',
      title: '',
      filter: true,
      type: 'boolean',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Студент"
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
