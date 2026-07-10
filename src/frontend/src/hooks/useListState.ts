'use client';

import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DataTableFilterMeta, DataTableSortMeta } from 'primereact/datatable';

import { SearchColumnsParam } from '@/types/helpers/SearchColumnsParam';
import { FieldDefinition } from '@/components/DataTable';
import { getQueryString } from '@/utils/queryStringConverter';
import { parseQueryString } from '@/utils/parseQueryString';
import useUserSettings, {
  getColumnHiddenSettingValue,
  getColumnWidthSettingValue,
  getColumnOrderSettingValue,
  getColumnSortSettingValue,
  SettingValueMap,
  FilterColumnSetting,
  SortColumnSetting,
} from '@/hooks/useUserSettings';
import { createUuid } from '@/utils/guidUtils';
import { QUERYPARAMS_LIMIT, PERPAGE_DEFAULTS } from '@/config/queryParams.config';

export default function useListState<TEntity extends { id: string }>(
  moduleName: string,
  defaults: Partial<Pick<SettingValueMap<TEntity>, keyof SettingValueMap<TEntity>>>
) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const stateId = searchParams.get('stateId');
  const [initialized, setInitialized] = useState(true);

  // Defaults.
  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<SearchColumnsParam | undefined>(undefined);

  const {
    settings: { perPage, columnSort: sorting, columnFilter: filter, columnWidth },
    updateSetting,
    applyFieldSettings,
    resetSettings,
    isReady: isReadyUserSettings,
    setSetting,
  } = useUserSettings<TEntity>(moduleName, defaults);

  const searchParamsForParse = useMemo(() => {
    let searchParamsForParse = new URLSearchParams(searchParams.toString());

    if (stateId) {
      const storedParamsString = sessionStorage.getItem(stateId);
      if (storedParamsString) {
        searchParamsForParse = new URLSearchParams(storedParamsString);
      }
    }

    return searchParamsForParse;
  }, [searchParams, stateId]);

  useEffect(() => {
    if (isReadyUserSettings && initialized) {
      const queryParams = parseQueryString(searchParamsForParse);

      if (queryParams.page >= 0) {
        setPage(queryParams.page);
      }

      if (queryParams.perPage) {
        setSetting('perPage', queryParams.perPage);
      }

      if (queryParams.sorting) {
        setSetting('columnSort', queryParams.sorting);
      }

      if (queryParams.filter) {
        setSetting('columnFilter', queryParams.filter);
      }

      if (queryParams.search) {
        setSearch(queryParams.search);
      }

      setIsReady(true);
      setInitialized(false);
    }
  }, [initialized, isReadyUserSettings, searchParamsForParse, setSetting, stateId]);

  useEffect(() => {
    if (isReady) {
      updateUrlSearchParams(stateId, { perPage, page, sorting: sorting, filter, search });
    }
  }, [isReady, stateId, perPage, page, sorting, filter, search]);

  const updatePerPage = (page: number, perPage: number) => {
    updateUrlSearchParams(stateId, { perPage: perPage, page: page, sorting, filter, search });
    updateSetting('perPage', perPage);
    setPage(page);
  };

  const updateSorting = (columns: DataTableSortMeta[]) => {
    const result = getColumnSortSettingValue<TEntity>(columns);
    updateUrlSearchParams(stateId, { perPage, page, sorting: result, filter, search });
    updateSetting('columnSort', getColumnSortSettingValue<TEntity>(result));
  };

  const updateVisibleColumns = (fields: FieldDefinition<TEntity>[], columns: string[]) => {
    updateSetting('columnHidden', getColumnHiddenSettingValue<TEntity>(fields, columns));
  };

  const updateColumnResize = (field: string | undefined, width: number) => {
    if (field) {
      updateSetting('columnWidth', getColumnWidthSettingValue<TEntity>(columnWidth, field, width));
    }
  };

  const updateColumnReorder = (fields: FieldDefinition<TEntity>[]) => {
    updateSetting('columnOrder', getColumnOrderSettingValue<TEntity>(fields));
  };

  const updateFilter = (value: FilterColumnSetting<TEntity> | undefined) => {
    if (value !== undefined) {
      updateUrlSearchParams(stateId, { perPage, page, sorting, filter: value, search });
      updateSetting('columnFilter', value);
    }
  };

  const handleRowClickWithState = (item: TEntity) => {
    router.push(`${pathname}/${item.id}?stateId=${getStateId(searchParams)}`);
  };

  const handleCreateButtonWithState = () => {
    router.push(`${pathname}/new?stateId=${getStateId(searchParams)}`);
  };

  const resetAll = () => {
    resetSettings();
    setPage(0);

    setSetting('perPage', defaults.perPage ?? PERPAGE_DEFAULTS);
    setSetting('columnSort', defaults.columnSort ?? []);
    setSetting('columnFilter', undefined);

    setSearch(undefined);

    updateUrlSearchParams(stateId, {
      perPage: defaults.perPage ?? PERPAGE_DEFAULTS,
      sorting: defaults.columnSort ?? [],
    });
  };

  return {
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
    params: {
      page,
      perPage,
      sorting,
      filter,
      search,

      setSearch: (value: SearchColumnsParam | undefined) => {
        updateUrlSearchParams(stateId, { perPage, page, sorting, filter, search: value });
        setSearch(value);
      },
    },
  };
}

function updateUrlSearchParams<T>(
  stateId: string | null,
  params: {
    perPage?: number;
    page?: number;
    sorting?: SortColumnSetting<T>;
    filter?: DataTableFilterMeta;
    search?: SearchColumnsParam;
  }
) {
  const { perPage, page, sorting, filter, search } = params;

  const currentUrl = new URL(window.location.href);
  const queryStr = getQueryString(perPage, page, sorting, filter, search);

  let url = `${currentUrl.origin}${currentUrl.pathname}`;
  if (url.length + queryStr.length > QUERYPARAMS_LIMIT) {
    const stateIdKey = stateId ?? createUuid();
    sessionStorage.setItem(stateIdKey, queryStr);

    url += `?stateId=${stateIdKey}`;
  } else {
    if (stateId) {
      sessionStorage.removeItem(stateId);
    }

    url += `${queryStr}`;
  }

  window.history.replaceState({}, '', url);
}

function getStateId(searchParams: ReadonlyURLSearchParams) {
  let stateId = searchParams.get('stateId');
  if (!stateId) {
    stateId = createUuid();

    sessionStorage.setItem(stateId, `?${searchParams.toString()}`);
  }

  return stateId;
}
