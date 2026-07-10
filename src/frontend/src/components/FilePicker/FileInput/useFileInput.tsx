'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

interface FileInputProps {
  /** Массив строк с разрешенными расширениями файлов (например, ['.jpg', '.png']). */
  accept?: string[];

  /** Максимальный размер файла в мегабайтах. */
  maxSizeMB?: number;

  /** Разрешить выбор нескольких файлов. */
  multiple?: boolean;

  /**
   * Если `true`, то компонент отключен.
   * @default false
   */
  disabled?: boolean;

  /**
   * Колбэк при загрузке файлов.
   * @param file - Загруженные файлы.
   */
  onUpload?: (file: File[] | File | null) => void;
}

/**
 * Хук для работы с файловым вводом, включая drag-and-drop функциональность.
 * @param {FileInputProps} props - Параметры файлового ввода.
 * @returns {Object} Объект с методами и состоянием для работы с файловым вводом.
 */
const useFileInput = ({ accept, multiple, disabled = false, maxSizeMB, onUpload }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const maxSizeFile = useMemo(() => maxSizeMB && maxSizeMB * 1024 * 1024, [maxSizeMB]);

  /** Открывает диалоговое окно выбора файлов. */
  const openFileDialog = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  /** Сбрасывает состояние валидации. */
  const resetState = useCallback(() => {
    setIsValid(true);
    setError('');
  }, []);

  /**
   * Валидирует файлы по размеру и типу.
   * @param {File[]} files - Массив файлов для валидации.
   * @returns {Promise<File[]>} Promise с массивом файлов или ошибкой.
   */
  const validateFiles = useCallback(
    (files: File[]) => {
      resetState();

      return new Promise<File[]>((resolve, reject) => {
        if (!files || files.length === 0) {
          return resolve(files);
        }

        if (maxSizeFile && files.some((f) => f.size > maxSizeFile)) {
          return reject(new Error(`Максимальный размер файла — ${maxSizeMB} МБ`));
        }

        if (accept && files.some((f) => !accept.some((ext) => f.name.toLowerCase().endsWith(ext.toLowerCase())))) {
          return reject(new Error(`Тип файла не поддерживается!`));
        }

        return resolve(files);
      });
    },
    [accept, maxSizeFile, maxSizeMB, resetState]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        if (onUpload) {
          onUpload(null);
        }
        return;
      }

      validateFiles(Array.from(files))
        .then((files) => {
          if (onUpload) {
            onUpload(multiple ? files : files[0]);
          }
        })
        .catch((e: Error) => {
          setError(e.message);
          setIsValid(false);
        })
        .finally(() => {
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        });
    },
    [multiple, onUpload, validateFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        handleFiles(e.target.files);
      }
    },
    [disabled, handleFiles]
  );

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (!disabled) {
        e.preventDefault();
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (!disabled) {
        e.preventDefault();
        setIsDragging(false);
      }
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (!disabled) {
        e.preventDefault();
        resetState();
      }
    },
    [disabled, resetState]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (!disabled) {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  /**
   * Возвращает пропсы для input[type="file"].
   * @returns {Object} Пропсы для input.
   */
  const getInputProps = useCallback(
    () => ({
      ref: inputRef,
      type: 'file',
      onChange: handleChange,
      style: { display: 'none' },
      accept: accept?.join(',') ?? '',
      multiple,
    }),
    [accept, handleChange, multiple]
  );

  /**
   * Возвращает пропсы для зоны перетаскивания файлов.
   * @returns {Object} Пропсы для зоны перетаскивания.
   */
  const getDropZoneProps = useCallback(
    () => ({
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    }),
    [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]
  );

  return {
    getInputProps,
    getDropZoneProps,
    openFileDialog,
    resetState,
    inputState: {
      isValid,
      isDragging,
      error,
    },
  };
};

export default useFileInput;
