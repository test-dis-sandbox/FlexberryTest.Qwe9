import { useRef, useEffect, useCallback } from 'react';

/**
 * Хук для отложенной отправки изменений по ключу (debounce).
 *
 * Если за время задержки приходит новое значение для того же ключа —
 * старое перезаписывается, и в итоге отправляется только последнее.
 *
 * @template TValue Тип значения для отправки.
 * @param handler Функция, которая вызывается после задержки с (key, value). ОБЯЗАТЕЛЬНО: Обернуть в useCallback.
 * @param delay Задержка в миллисекундах (по умолчанию 300).
 * @returns Объект с методами:
 * - `schedule(key, value)` — запланировать отправку,
 * - `flushKey(key)` — немедленно отправить отложенное значение по ключу,
 * - `flushAll()` — немедленно отправить все отложенные значения.
 */
export function useKeyedDebouncer<TValue = unknown>(handler: (key: string, value: TValue) => void, delay = 300) {
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const lastValuesRef = useRef<Map<string, TValue>>(new Map());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      timersRef.current.forEach((timer, key) => {
        clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const lastValue = lastValuesRef.current.get(key);
        if (lastValue !== undefined) {
          try {
            handler(key, lastValue);
          } catch (e) {
            console.error(e);
          }
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timersRef.current.clear();
      lastValuesRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Запланировать отправку.
  const schedule = useCallback(
    (key: string, value: TValue) => {
      // Сохраняем последнее значение.
      lastValuesRef.current.set(key, value);

      // Если таймер был — сбросим.
      const prev = timersRef.current.get(key);
      if (prev) {
        clearTimeout(prev);
      }

      const timeout = setTimeout(() => {
        // Прочитаем последний value и вызовем handler.
        const lastValue = lastValuesRef.current.get(key);
        if (lastValue !== undefined && mountedRef.current) {
          handler(key, lastValue);
        }
        timersRef.current.delete(key);
        lastValuesRef.current.delete(key);
      }, delay);

      timersRef.current.set(key, timeout);
    },
    [handler, delay]
  );

  /**
   * Немедленно отправить отложенное значение по ключу.
   */
  const flushKey = useCallback(
    (key: string) => {
      const timer = timersRef.current.get(key);
      if (timer) {
        clearTimeout(timer);
        const v = lastValuesRef.current.get(key);
        timersRef.current.delete(key);
        lastValuesRef.current.delete(key);
        if (v !== undefined) {
          handler(key, v);
        }
      }
    },
    [handler]
  );

  /**
   * Немедленно отправить все отложенные значения.
   */
  const flushAll = useCallback(() => {
    timersRef.current.forEach((timer, key) => {
      clearTimeout(timer);
      const lastValue = lastValuesRef.current.get(key);
      if (lastValue !== undefined) {
        handler(key, lastValue);
      }
    });
    timersRef.current.clear();
    lastValuesRef.current.clear();
  }, [handler]);

  return { schedule, flushKey, flushAll };
}
