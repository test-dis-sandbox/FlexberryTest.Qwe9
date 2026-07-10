'use client';

import { Alert, Box, Snackbar, Stack } from '@mui/material';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createUuid } from '@/utils/guidUtils';

export interface NotificationContextProps {
  notifications: Notification[];
  /**
   * Функция для отображения уведомления об ошибке.
   * @param {string | string[]} message - Текст сообщения или массив сообщений об ошибке.
   */
  showError: (message: string | string[]) => void;
  /**
   * Функция для отображения уведомления предупреждения.
   * @param {string | string[]} message - Текст сообщения или массив сообщений предупреждений.
   */
  showWarning: (message: string | string[]) => void;
  /**
   * Функция для отображения уведомления об успехе.
   * @param {string | string[]} message - Текст сообщения или массив сообщений об успехе.
   */
  showSuccess: (message: string | string[]) => void;
  /**
   * Функция для удаления уведомления по его идентификатору.
   * @param {NonEmptyString} id - Идентификатор уведомления, которое нужно удалить.
   */
  removeNotification: (id: NonEmptyString) => void;
}

export interface NotificationProviderProps {
  children: React.ReactNode;
  /**
   * Длительность автоматического скрытия уведомления (мс).
   * @default 4000
   */
  autoHideDuration?: number;
  /**
   * Максимальное количество одновременно отображаемых уведомлений.
   * @default 4
   */
  maxVisible?: number;
  /**
   * Позиция отображения уведомлений.
   */
  position?: {
    /**
     * Вертикальное положение.
     * @default 'bottom'
     */
    vertical: 'top' | 'bottom';
    /**
     * Горизонтальное положение.
     * @default 'left'
     */
    horizontal: 'left' | 'center' | 'right';
  };
}

export interface Notification {
  id: NonEmptyString;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

/**
 * Провайдер уведомлений.
 * @component
 * @param {NotificationProviderProps} props - Свойства компонента.
 */
const NotificationProvider = ({
  children,
  autoHideDuration = 4000,
  maxVisible = 4,
  position = { vertical: 'bottom', horizontal: 'left' },
}: NotificationProviderProps) => {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    const currentTimers = timers.current;
    return () => {
      Object.values(currentTimers).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const removeNotification = useCallback((id: NonEmptyString) => {
    setAllNotifications((prev) => prev.filter((n) => n.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const addNotification = useCallback(
    (message: string, type: Notification['type'] = 'info') => {
      const id = createUuid();
      const newNotification: Notification = { id, message, type };

      setAllNotifications((prev) => [newNotification, ...prev]);

      const timer = setTimeout(() => {
        removeNotification(id);
      }, autoHideDuration);

      timers.current[id] = timer;
    },
    [autoHideDuration, removeNotification]
  );

  const showError = useCallback(
    (message: string | string[]) => {
      const newMessages = Array.isArray(message) ? message : [message];
      newMessages.forEach((m) => addNotification(m, 'error'));
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string | string[]) => {
      const newMessages = Array.isArray(message) ? message : [message];
      newMessages.forEach((m) => addNotification(m, 'warning'));
    },
    [addNotification]
  );

  const showSuccess = useCallback(
    (message: string | string[]) => {
      const newMessages = Array.isArray(message) ? message : [message];
      newMessages.forEach((m) => addNotification(m, 'success'));
    },
    [addNotification]
  );

  const getVisibleNotifications = () => {
    if (allNotifications.length <= maxVisible) {
      return allNotifications;
    }

    const visible = allNotifications.slice(0, maxVisible - 1);
    const hiddenCount = allNotifications.length - maxVisible;
    const lastNotification = allNotifications[maxVisible - 1];
    return [...visible, { ...lastNotification, message: `${lastNotification.message} (+${hiddenCount} ещё)` }];
  };

  const visibleNotifications = getVisibleNotifications();

  const contextValue = useMemo(
    () => ({
      notifications: visibleNotifications,
      showError,
      showWarning,
      showSuccess,
      removeNotification,
    }),
    [visibleNotifications, showError, showSuccess, showWarning, removeNotification]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={visibleNotifications.length > 0}
        anchorOrigin={position}
        sx={{ maxWidth: '100%' }}
      >
        <Box>
          <Stack
            spacing={2}
            flexWrap="wrap"
          >
            {visibleNotifications.map((notification) => (
              <Alert
                key={notification.id}
                severity={notification.type}
                onClose={() => removeNotification(notification.id)}
                sx={{ width: '100%', whiteSpace: 'pre-line' }}
              >
                {notification.message}
              </Alert>
            ))}
          </Stack>
        </Box>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
