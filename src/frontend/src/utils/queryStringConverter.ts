import dayjs from 'dayjs';
import {
  DataTableFilterMeta,
  DataTableFilterMetaData,
  DataTableOperatorFilterMetaData,
  DataTableSortMeta,
} from 'primereact/datatable';

import { SearchColumnsParam } from '@/types/helpers/SearchColumnsParam';
import { DateOnly } from '@/utils/dateUtils';

export function getQueryString(
  perPage?: number,
  page?: number,
  sorting?: DataTableSortMeta[],
  filter?: DataTableFilterMeta,
  search?: SearchColumnsParam
): string {
  const queryStr: string[] = [];
  if (Number.isInteger(perPage) && Number.isInteger(page)) {
    queryStr.push(`page=${page}&perPage=${perPage}`);
  }

  if (sorting && sorting.length > 0) {
    sorting.forEach((sort) => {
      let fieldName = capitalize(sort.field);
      if (!fieldName) {
        return;
      }

      if (sort.order === -1) {
        fieldName = '-' + fieldName;
      }

      if (sort.order === -1 || sort.order === 1) {
        queryStr.push(`sorting=${fieldName}`);
      }
    });
  }

  if (filter) {
    Object.keys(filter).forEach((key) => {
      let filterOperator: DataTableFilterMetaData;
      if ('constraints' in filter[key]) {
        filterOperator = (filter[key] as DataTableOperatorFilterMetaData).constraints[0];
      } else {
        filterOperator = filter[key] as DataTableFilterMetaData;
      }

      const filterValue = filterOperator?.value;
      const propName = capitalize(key);
      let filterOperation: string | undefined = filterOperator?.matchMode;
      switch (filterOperation) {
        case 'equals':
          filterOperation = 'eq';
          break;
        case 'notEquals':
          filterOperation = 'neq';
          break;
        case 'contains':
        case 'notContains':
        case 'gte':
        case 'lte':
        case 'lt':
        case 'gt':
          break;
        case 'dateBefore':
          filterOperation = 'ltd';
          break;
        case 'dateAfter':
          filterOperation = 'gtd';
          break;
        case 'dateIs':
          filterOperation = 'eqd';
          break;
        default:
          filterOperation = undefined;
          break;
      }

      if (filterOperation || (filterValue !== undefined && filterValue !== null)) {
        if (!(filterValue instanceof Array)) {
          queryStr.push(`filter.${propName}=${formatValue(filterValue)}`);
        } else {
          filterValue.forEach((value) => queryStr.push(`filter.${propName}=${formatValue(value)}`));
        }
      }

      if (filterOperation) {
        queryStr.push(`filter.${propName}Op=${filterOperation}`);
      }
    });
  }

  if (search?.searchText && search.searchText?.length > 0) {
    queryStr.push(`filter.SearchText=${search.searchText}`);

    if (search.searchColumns?.length > 0) {
      queryStr.push(`filter.SearchColumns=${search.searchColumns}`);
    }

    if (search.searchColumnsEq?.length > 0) {
      const num = Number(search.searchText);
      if (!Number.isNaN(num) && isFinite(num)) {
        queryStr.push(`filter.SearchColumnsEq=${search.searchColumnsEq}`);
      }
    }

    if (search.searchColumnsDate?.length > 0) {
      const dateIsValid = dayjs(search.searchText, 'DD.MM.YYYY', true).isValid();
      if (dateIsValid) {
        queryStr.push(`filter.SearchColumnsDate=${search.searchColumnsDate}`);
      }
    }

    if (search.searchColumnsDateTime?.length > 0) {
      const date = dayjs(search.searchText, 'DD.MM.YYYY', true);
      if (date.isValid()) {
        queryStr.push(`filter.SearchColumnsDateTime=${search.searchColumnsDateTime}`);
        queryStr.push(`filter.SearchDate=${date.toISOString()}`);
      }
    }
  }

  return queryStr.length > 0 ? '?' + queryStr.join('&') : '';
}

export function capitalize(value: string) {
  if (value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}

function formatValue(value: unknown) {
  if (value instanceof Date || value instanceof DateOnly) {
    return value.toISOString();
  }

  if (value === null || value === undefined) {
    return '';
  }

  return value;
}
