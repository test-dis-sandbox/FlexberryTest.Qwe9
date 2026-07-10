'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllTeacher from '@/hooks/Teacher/useGetAllTeacher';
import useDeleteAllTeacher from '@/hooks/Teacher/useDeleteAllTeacher';
import { tAcademicDegree } from '@/enums/tAcademicDegree.types';
import { tView } from '@/enums/tView.types';
import { ITeacherL } from '@/types/Teacher.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function TeacherPageList() {
  const viewName: string = 'TeacherL';

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
  } = useListState<ITeacherL>('TeacherPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllTeacher<ITeacherL>({
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

  const { deleteAllTeacher } = useDeleteAllTeacher(handleSuccess, handleError);

  const handleDelete = (items: ITeacherL[]) => {
    deleteAllTeacher(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.TeacherL,
    fileName: 'TeacherL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'dateOfBirth',
      title: 'Дата рождения',
      filter: true,
      type: 'date',
    },
    {
      field: 'degree',
      title: 'Научная степень',
      filter: true,
      type: 'enum',
      options: tAcademicDegree,
    },
    {
      field: 'fullName',
      title: 'ФИО',
      filter: true,
      type: 'text',
    },
    {
      field: 'partTime',
      title: 'Совместитель',
      filter: true,
      type: 'boolean',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Преподаватель"
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
