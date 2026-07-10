import dayjs from 'dayjs';
import { DataTableFilterMeta, DataTableFilterMetaData, DataTableSortMeta } from 'primereact/datatable';

import { PERPAGE_DEFAULTS } from '@/config/queryParams.config';
import { SearchColumnsParam } from '@/types/helpers/SearchColumnsParam';
type MatchModeType = DataTableFilterMetaData['matchMode'];

export function parseQueryString(searchParams: URLSearchParams): {
  perPage: number | undefined;
  page: number;
  sorting: DataTableSortMeta[] | undefined;
  filter: DataTableFilterMeta | undefined;
  search: SearchColumnsParam | undefined;
} {
  const result = {
    perPage: undefined as number | undefined,
    page: 0,
    sorting: undefined as DataTableSortMeta[] | undefined,
    filter: undefined as DataTableFilterMeta | undefined,
    search: undefined as SearchColumnsParam | undefined,
  };

  // Parse pagination
  const pageStr = searchParams.get('page');
  if (pageStr) {
    const pageVal = parseInt(pageStr, 10);
    if (!isNaN(pageVal) && isFinite(pageVal) && pageVal >= 0) {
      result.page = pageVal;
    } else {
      result.page = PERPAGE_DEFAULTS;
    }
  }

  const perPageStr = searchParams.get('perPage');
  if (perPageStr) {
    const perPageVal = parseInt(perPageStr, 10);
    if (!isNaN(perPageVal) && isFinite(perPageVal) && perPageVal > 0) {
      result.perPage = perPageVal;
    }
  }

  const sortingParams = searchParams.getAll('sorting');
  if (sortingParams.length > 0) {
    const sorting: DataTableSortMeta[] = [];
    sortingParams.forEach((sortStr) => {
      if (!sortStr) {
        return;
      }

      let field = sortStr;
      let order: 1 | -1 = 1;

      if (sortStr.startsWith('-')) {
        field = sortStr.slice(1);
        order = -1;
      }

      if (field) {
        sorting.push({
          field: decapitalize(field),
          order,
        });
      }
    });
    result.sorting = sorting;
  }

  // Parse filters
  const filter: DataTableFilterMeta = {};
  const valueKeys = Array.from(searchParams.keys()).filter((key) => key.startsWith('filter.') && !key.endsWith('Op'));

  const fieldNames = new Set<string>();
  valueKeys.forEach((key) => {
    const fieldName = key.replace(/^filter\./, '');
    if (fieldName && !fieldName.startsWith('Search')) {
      fieldNames.add(fieldName);
    }
  });

  fieldNames.forEach((fieldName) => {
    const values = searchParams.getAll(`filter.${fieldName}`);
    const opValue = searchParams.get(`filter.${fieldName}Op`) ?? undefined;

    if (values.length === 0) {
      return;
    }

    const parsedValues = values.map((v) => parseFilterValue(v));
    const matchMode = reverseMatchMode(opValue);

    const fieldKey = decapitalize(fieldName);

    filter[fieldKey] = {
      value: parsedValues[0],
      matchMode,
    };
  });

  if (Object.keys(filter).length > 0) {
    result.filter = filter;
  }

  // Parse search
  const searchText = searchParams.get('filter.SearchText');
  if (searchText) {
    const searchObj: Partial<SearchColumnsParam> = { searchText };

    const searchColumns = searchParams.get('filter.SearchColumns');
    if (searchColumns) {
      searchObj.searchColumns = searchColumns;
    }

    const searchColumnsEq = searchParams.get('filter.SearchColumnsEq');
    if (searchColumnsEq) {
      searchObj.searchColumnsEq = searchColumnsEq;
    }

    const searchColumnsDate = searchParams.get('filter.SearchColumnsDate');
    if (searchColumnsDate) {
      searchObj.searchColumnsDate = searchColumnsDate;
    }

    const searchColumnsDateTime = searchParams.get('filter.SearchColumnsDateTime');
    if (searchColumnsDateTime) {
      searchObj.searchColumnsDateTime = searchColumnsDateTime;
    }

    result.search = searchObj as SearchColumnsParam;
  }

  return result;
}

function decapitalize(value: string) {
  if (value) {
    return value.charAt(0).toLowerCase() + value.slice(1);
  }
  return value;
}

function reverseMatchMode(opStr?: string | undefined): MatchModeType {
  switch (opStr) {
    case 'contains':
    case 'notContains':
    case 'gte':
    case 'lte':
    case 'lt':
    case 'gt':
      return opStr;
    case 'eq':
      return 'equals';
    case 'neq':
      return 'notEquals';
    case 'ltd':
      return 'dateBefore';
    case 'gtd':
      return 'dateAfter';
    case 'eqd':
      return 'dateIs';
    default:
      return undefined;
  }
}

function parseFilterValue(str: string): string | Date | number | null {
  if (str === '') {
    return null;
  }

  const date = dayjs(str);
  if (date.isValid() && str.includes('T')) {
    return new Date(str);
  }

  const num = Number(str);
  if (!isNaN(num) && isFinite(num)) {
    return num;
  }

  return str;
}
