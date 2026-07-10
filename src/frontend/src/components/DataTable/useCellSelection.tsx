import { useCallback, useState } from 'react';

/**
 * Возвращаемый объект хука `useCellSelection` для управления выбором ячеек.
 */
interface CellSelectionReturn {
  /** Объект с выбранными ячейками. */
  selectedCells: Record<NonEmptyString, Set<string>>;

  /**
   * Проверяет, выбрана ли ячейка.
   * @param {NonEmptyString} rowId Уникальный идентификатор строки.
   * @param {string} field Имя поля.
   * @returns {boolean} `true`, если ячейка выбрана.
   */
  isSelected: (rowId: NonEmptyString, field: string) => boolean;

  /**
   * Переключает состояние выбора ячейки.
   * @param {NonEmptyString} rowId Уникальный идентификатор строки.
   * @param {string} field Имя поля.
   */
  toggleCell: (rowId: NonEmptyString, field: string) => void;

  /**
   * Снимает выделение с указанных строк.
   * @param {NonEmptyString[]} rowIds — Уникальные идентификаторы строк для снятия выделения.
   */
  clearSelection: (rowIds: NonEmptyString[]) => void;
}

/**
 * Хук для управления состоянием выбора ячеек в таблице.
 * @returns {CellSelectionReturn} Объект с состоянием и методами для работы с выбором.
 */
const useCellSelection = (): CellSelectionReturn => {
  const [selectedCells, setSelectedCells] = useState<Record<NonEmptyString, Set<string>>>({});

  const toggleCell = useCallback(
    (rowId: NonEmptyString, field: string) => {
      setSelectedCells((prev) => {
        const newState = { ...prev };
        newState[rowId] = new Set(newState[rowId] || []);

        if (newState[rowId].has(field)) {
          newState[rowId].delete(field);
        } else {
          newState[rowId].add(field);
        }

        if (newState[rowId].size === 0) {
          delete newState[rowId];
        }

        return newState;
      });
    },
    [setSelectedCells]
  );

  const isSelected = useCallback(
    (rowId: NonEmptyString, field: string) => {
      return Boolean(selectedCells[rowId]?.has(field));
    },
    [selectedCells]
  );

  const clearSelection = useCallback(
    (rowIds: NonEmptyString[]) => {
      setSelectedCells((prev) => {
        const newState = { ...prev };
        rowIds.forEach((rowId) => {
          delete newState[rowId];
        });

        return newState;
      });
    },
    [setSelectedCells]
  );

  return { selectedCells, isSelected, toggleCell, clearSelection };
};

export default useCellSelection;
