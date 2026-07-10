'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllGroup from '@/hooks/Group/useGetAllGroup';
import useDeleteAllGroup from '@/hooks/Group/useDeleteAllGroup';
import { tEducationForm } from '@/enums/tEducationForm.types';
import { tView } from '@/enums/tView.types';
import { IGroupL } from '@/types/Group.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function GroupPageList() {
  const viewName: string = 'GroupL';

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
  } = useListState<IGroupL>('GroupPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllGroup<IGroupL>({
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

  const { deleteAllGroup } = useDeleteAllGroup(handleSuccess, handleError);

  const handleDelete = (items: IGroupL[]) => {
    deleteAllGroup(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.GroupL,
    fileName: 'GroupL',
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
      field: 'fullName',
      title: 'Полное название',
      filter: true,
      type: 'text',
    },
    {
      field: 'enrollmentYear',
      title: 'Год поступления',
      filter: true,
      type: 'date',
    },
    {
      field: 'form',
      title: 'Форма обучения',
      filter: true,
      type: 'enum',
      options: tEducationForm,
    },
    {
      field: 'isMaster',
      title: 'Магистратура',
      filter: true,
      type: 'boolean',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Группа"
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
