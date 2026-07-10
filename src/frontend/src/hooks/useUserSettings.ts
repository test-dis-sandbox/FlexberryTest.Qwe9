import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useState } from 'react';
import { DataTableFilterMetaData, DataTableOperatorFilterMetaData, DataTableSortMeta } from 'primereact/datatable';

import { firstLetterToLower, isJsonString, unknownToString } from '@/utils/stringUtils';
import { FieldDefinition } from '@/components/DataTable';
import { UserSettingsService } from '@/services/UserSettingsService';
import { useNotification } from '@/components/Notification';
import { formatError } from '@/utils/errorsUtils';

import { useKeyedDebouncer } from './useKeyedDebouncer';
export type SettingName = 'columnSort' | 'columnOrder' | 'columnWidth' | 'columnHidden' | 'perPage' | 'columnFilter';
export type SettingValueType = 'StrVal' | 'TxtVal' | 'IntVal' | 'BoolVal' | 'GuidVal' | 'DecimalVal' | 'DateTimeVal';

export interface UserSettingDto {
  settingName: SettingName;
  moduleName: string;
  valueAsString: string;
  valueType: SettingValueType;
}

type ColumnKey<T> = Extract<keyof T, string>;
type ColumnSetting<T, TValue> = Partial<Record<ColumnKey<T>, TValue>>;
type SortMeta<T> = {
  field: ColumnKey<T>;
  order: 1 | -1;
};

export type SortColumnSetting<T> = SortMeta<T>[] | undefined;
export type NumberColumnSetting<T> = ColumnSetting<T, number>;
export type BooleanColumnSetting<T> = ColumnSetting<T, boolean>;
export type FilterColumnSetting<T> = Partial<
  Record<ColumnKey<T>, DataTableFilterMetaData | DataTableOperatorFilterMetaData>
> & {
  [key: string]: DataTableFilterMetaData | DataTableOperatorFilterMetaData;
};

// Карта настроек, зависящая от сущности.
export type SettingValueMap<TEntity> = {
  columnSort: SortColumnSetting<TEntity>;
  columnOrder: NumberColumnSetting<TEntity>;
  columnWidth: NumberColumnSetting<TEntity>;
  columnHidden: BooleanColumnSetting<TEntity>;
  perPage: number;
  columnFilter: FilterColumnSetting<TEntity>;
};

/**
 * Хук для работы с пользовательскими настройками модулей.
 *
 * Автоматически подгружает настройки с бэкенда, хранит их в состоянии
 * и синхронизирует изменения с сервером (с дебаунсом).
 *
 * @template TDefaults Тип объекта с настройками по умолчанию.
 * @param moduleName Имя модуля, для которого загружаются настройки.
 * @param defaults Значения по умолчанию для указанных настроек.
 * @returns Объект с методами и состоянием:
 * - `settings` — текущие настройки пользователя,
 * - `updateSetting(key, value)` — обновление одной настройки с отправкой на сервер,
 * - `applyFieldSettings(fields)` — применяет columnHidden/Width/Order к массиву столбцов,
 * - `isLoading` — индикатор загрузки настроек.
 */
export default function useUserSettings<TEntity>(
  moduleName: string,
  defaults: Partial<Pick<SettingValueMap<TEntity>, keyof SettingValueMap<TEntity>>>
) {
  type Settings<TEntity> = Partial<SettingValueMap<TEntity>>;

  const queryClient = useQueryClient();

  /** Флаг готовности настроек пользователя. */
  const [isReady, setIsReady] = useState(false);
  const { showError, showSuccess } = useNotification();
  const [settings, setSettings] = useState<Settings<TEntity>>(defaults);

  const { data, isLoading } = useQuery({
    queryKey: ['usersettings', moduleName],
    queryFn: async () => {
      const data = await UserSettingsService.getUserSettings(moduleName, Object.keys(defaults));
      return data;
    },
  });

  useEffect(() => {
    // Конвертация DTO настроек в фронтовое представление.
    if (data) {
      const parsed: Record<string, unknown> = {};

      data.forEach((s) => {
        parsed[firstLetterToLower(s.settingName)] = parseValue(s);
      });

      setSettings((prev) => ({ ...prev, ...parsed }));

      setIsReady(true);
    } else if (!isLoading) {
      setIsReady(true);
    }
  }, [data, isLoading]);

  const mutation = useMutation({
    mutationFn: async ({ key, value }: { key: SettingName; value: unknown }) => {
      let setting = data?.find((x) => x.settingName.toLocaleLowerCase() === key.toLocaleLowerCase());

      if (!setting) {
        setting = {
          settingName: key,
          moduleName,
          valueAsString: unknownToString(value),
          valueType: getSettingValueType(value),
        };
      } else {
        setting.valueAsString = unknownToString(value);
      }

      await UserSettingsService.updateUserSetting(setting);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersettings', moduleName] });
    },
    onError: () => {},
  });

  const triggerMutate = useCallback(
    (key: SettingName, value: unknown) => {
      mutation.mutate({ key, value });
    },
    [mutation]
  ) as (key: string, value: unknown) => void;

  const { schedule: debouncedMutate, flushAll: flushDebouncedMutations } = useKeyedDebouncer<unknown>(
    triggerMutate,
    1500
  );

  /**
   * Функция обновления настройки.
   * @param key - Наименование настройки.
   * @param value - Значение настройки.
   */
  function updateSetting<K extends keyof Settings<TEntity>>(key: SettingName, value: Settings<TEntity>[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    debouncedMutate(key, value);
  }

  const mutationReset = useMutation({
    mutationFn: async () => {
      await UserSettingsService.deleteAllUserSettings(moduleName);
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['usersettings', moduleName] });
      showSuccess('Настройки успешно сброшены.');
      setSettings(defaults);
    },
    onError: (error) => {
      showError(`Ошибка при сбросе пользовательских настроек: ${formatError(error)}`);
    },
  });

  const resetSettings = async () => {
    if (mutationReset.isPending) {
      return;
    }
    flushDebouncedMutations();
    await mutationReset.mutateAsync();
    setSettings(defaults);
  };
  /**
   * Функция применения настроек на столбцы Olv.
   * @param fields Столбцы.
   * @returns {FieldDefinition[]}
   */
  const applyFieldSettings = useCallback(
    (fields: Array<FieldDefinition<TEntity> & { field: ColumnKey<TEntity> }>): FieldDefinition<TEntity>[] => {
      let updated = fields.map((field) => {
        const hidden = Boolean(settings.columnHidden?.[field.field]);
        const columnWidth = settings.columnWidth?.[field.field];

        return {
          ...field,
          hidden,
          width: columnWidth && !isNaN(columnWidth) ? `${columnWidth}px` : field.width,
        };
      });

      if (settings.columnOrder) {
        // Пересортируем порядок столбцов, если была соответствующая настройка.
        const withOrder = updated.filter((f) => typeof settings.columnOrder?.[f.field] === 'number');
        const withoutOrder = updated.filter((f) => typeof settings.columnOrder?.[f.field] !== 'number');
        updated = [
          ...withOrder.sort((a, b) => {
            const aOrder = settings.columnOrder?.[a.field];
            const bOrder = settings.columnOrder?.[b.field];
            return (aOrder ?? 0) - (bOrder ?? 0);
          }),
          ...withoutOrder,
        ];
      }

      return updated as FieldDefinition<TEntity>[];
    },
    [settings.columnHidden, settings.columnOrder, settings.columnWidth]
  );

  const setSetting = useCallback((key: SettingName, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    isLoading,
    isReady,
    applyFieldSettings,
    setSetting: setSetting,
  };
}

export const getColumnHiddenSettingValue = <T>(fields: FieldDefinition<T>[], columns: string[]) => {
  return Object.values(fields).reduce<BooleanColumnSetting<T>>(
    (prev, curr) => ({ ...prev, [curr.field]: !columns.includes(curr.field) }),
    {}
  );
};

export const getColumnWidthSettingValue = <T>(
  columnWidth: NumberColumnSetting<T> | undefined,
  field: string,
  width: number
) => {
  return <NumberColumnSetting<T>>{ ...columnWidth, [field]: width };
};

export const getColumnOrderSettingValue = <T>(fields: FieldDefinition<T>[]) => {
  return fields.reduce<NumberColumnSetting<T>>((prev, curr, index) => ({ ...prev, [curr.field]: index + 1 }), {});
};

export const getColumnSortSettingValue = <T>(multiSortMeta?: DataTableSortMeta[] | undefined): SortColumnSetting<T> => {
  if (!multiSortMeta || !Array.isArray(multiSortMeta) || multiSortMeta.length === 0) {
    return undefined;
  }

  const result = multiSortMeta.map((m) => ({ field: m.field, order: m.order })) as DataTableSortMeta[];
  return result as SortColumnSetting<T>;
};

function getSettingValueType(value: unknown): SettingValueType {
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return 'IntVal';
    }

    return 'DecimalVal';
  }

  if (typeof value === 'boolean') {
    return 'BoolVal';
  }

  if (value instanceof Date) {
    return 'DateTimeVal';
  }

  return 'TxtVal';
}

function parseValue(setting: UserSettingDto) {
  switch (setting.valueType) {
    case 'IntVal':
      return Number(setting.valueAsString);
    case 'DecimalVal': {
      // Убираем пробелы и запятые-разделители тысяч.
      const cleaned = setting.valueType.replace(/[\s,]/g, '');
      return Number(cleaned);
    }

    case 'BoolVal':
      return setting.valueAsString === 'true';

    case 'StrVal':
    case 'TxtVal': {
      if (isJsonString(setting.valueAsString)) {
        return JSON.parse(setting.valueAsString);
      }

      return setting.valueAsString;
    }

    case 'DateTimeVal':
      return new Date(setting.valueAsString);
    default:
      return setting.valueAsString;
  }
}
