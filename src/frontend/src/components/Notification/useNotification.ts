'use client';

import { useContext } from 'react';

import { NotificationContext } from './NotificationProvider';

/**
 * Хук для использования контекста уведомлений.
 * @returns {NotificationContextProps} Контекст уведомлений.
 * @throws {Error} Если хук используется вне NotificationProvider.
 */
const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification должен использоваться внутри NotificationProvider.');
  }
  return context;
};

export default useNotification;
