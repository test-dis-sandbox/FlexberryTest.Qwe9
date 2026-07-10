import {
  Path,
  UseFormGetValues,
  UseFormSetValue,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldValues,
} from 'react-hook-form';

/**
 * Автоматически перенумеровывает указанный числовой столбец в массиве формы.
 *
 * Используется совместно с react-hook-form, например для проставления
 * порядковых номеров (1, 2, 3, ...) при добавлении, удалении или
 * изменении порядка элементов useFieldArray.
 *
 * @template F Тип всех значений формы (объект, передаваемый в useForm).
 * @template A Путь к массиву в форме.
 * @template K Ключ одного элемента массива, который нужно перенумеровать.
 *
 * @param getValues Функция react-hook-form `getValues` для получения текущего массива.
 * @param setValue Функция react-hook-form `setValue` для записи новых значений.
 * @param arrayName Путь к массиву в данных формы.
 * @param fieldName Имя поля внутри каждого элемента массива, в которое нужно записать номер (например, `'orderNumber'`).
 */
export default function autoOrderNumber<
  F extends FieldValues,
  A extends FieldArrayPath<F>, // Путь к массив.
  K extends keyof FieldArrayPathValue<F, A>[number], // Ключ элемента массива.
>(getValues: UseFormGetValues<F>, setValue: UseFormSetValue<F>, arrayName: A, fieldName: K) {
  const arr = getValues(arrayName as Path<F>) as FieldArrayPathValue<F, A>;

  arr.forEach((_: FieldArrayPathValue<F, A>[number], index: number) => {
    const path = `${arrayName}.${index}.${String(fieldName)}` as Path<F>;
    const value = (index + 1) as FieldArrayPathValue<F, A>[number][K]; // Тип поля из массива.

    setValue(path, value, { shouldDirty: true });
  });
}
