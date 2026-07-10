import { DataTableFilterMeta, DataTableSortMeta } from 'primereact/datatable';

import { SearchColumnsParam } from '@/types/helpers/SearchColumnsParam';

export interface GetAllRequestOptions {
  viewName: string;
  perPage?: number;
  page?: number;
  sorting?: DataTableSortMeta[];
  filter?: DataTableFilterMeta;
  search?: SearchColumnsParam;
  enabled?: boolean;
}
