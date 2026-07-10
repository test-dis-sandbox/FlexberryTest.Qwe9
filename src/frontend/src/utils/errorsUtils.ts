import axios, { AxiosError } from 'axios';
import { FieldErrors, FieldValues } from 'react-hook-form';

export const formatError = (error: AxiosError | Error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || error.message || 'Ошибка сервера';
  }

  return error.message || 'Неизвестная ошибка';
};

export const getErrorMessages = <T extends FieldValues>(
  errors: FieldErrors<T> | FieldErrors<T>[] | undefined
): string[] => {
  if (!errors) {
    return [];
  }

  return Object.values(errors).reduce<string[]>((acc, error) => {
    if (!error) {
      return acc;
    }

    if (error.message) {
      return [...acc, error.message as string];
    }

    if (typeof error === 'object') {
      return [...acc, ...getErrorMessages(error as FieldErrors<FieldValues>)];
    }

    return acc;
  }, []);
};
