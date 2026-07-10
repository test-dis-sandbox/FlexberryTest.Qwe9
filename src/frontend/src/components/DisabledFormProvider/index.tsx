import React, { createContext, useContext, ReactNode } from 'react';

type DisabledContextType = {
  disabled: boolean;
};

/**
 * Контекст для управления состоянием disabled в формах
 * @type {React.Context<DisabledContextType>}
 */
const DisabledContext: React.Context<DisabledContextType> = createContext<DisabledContextType>({ disabled: false });

/**
 * Хук для получения состояния disabled из контекста формы
 * @returns {DisabledContextType} Объект с полем disabled, указывающим, заблокирована ли форма
 * @example
 * const { disabled } = useFormDisabled();
 *
 * <Button disabled={disabled}>Отправить</Button>
 */
export function useFormDisabled(): DisabledContextType {
  const ctx = useContext(DisabledContext);

  return ctx;
}

/**
 * Провайдер контекста для управления состоянием disabled в дочерних компонентах
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.disabled - Флаг, указывающий должны ли быть заблокированы элементы формы
 * @param {React.ReactNode} props.children - Дочерние компоненты, которые будут иметь доступ к контексту
 * @returns {React.JSX.Element} Провайдер контекста
 * @example
 * <DisabledFormProvider disabled={true}>
 *   <MyFormComponent />
 * </DisabledFormProvider>
 */
export default function DisabledFormProvider({
  disabled: initDisabled,
  children,
}: {
  disabled: boolean;
  children: ReactNode;
}): React.JSX.Element {
  return <DisabledContext.Provider value={{ disabled: initDisabled }}>{children}</DisabledContext.Provider>;
}
