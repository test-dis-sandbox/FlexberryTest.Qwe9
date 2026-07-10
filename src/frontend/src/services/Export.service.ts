import { DataTableFilterMeta, DataTableSortMeta } from 'primereact/datatable';

import axiosInstance from '@/api/instance';
import { getQueryString } from '@/utils/queryStringConverter';
import { SearchColumnsParam } from '@/types/helpers/SearchColumnsParam';

export const ExportService = {
  async ExportList(
    viewName: string,
    columns: string[],
    sorting?: DataTableSortMeta[],
    filter?: DataTableFilterMeta,
    search?: SearchColumnsParam
  ) {
    const queryStr = getQueryString(undefined, undefined, sorting, filter, search);
    const sep = queryStr ? '&' : '?';
    return await axiosInstance.get(
      `/export/${viewName}${queryStr}${sep}columns=${encodeURIComponent(JSON.stringify(columns))}`,
      { responseType: 'blob' }
    );
  },
};
