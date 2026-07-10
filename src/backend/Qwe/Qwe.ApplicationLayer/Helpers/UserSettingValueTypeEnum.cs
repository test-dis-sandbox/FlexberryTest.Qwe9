namespace Qwe.ApplicationLayer.Helpers
{
    /// <summary>
    /// Возможные типы значений настроек пользователя.
    /// </summary>
    public enum UserSettingValueTypeEnum
    {
        /// <summary>
        /// Строка.
        /// </summary>
        StrVal,

        /// <summary>
        /// Текст.
        /// </summary>
        TxtVal,

        /// <summary>
        /// Целое число.
        /// </summary>
        IntVal,

        /// <summary>
        /// Логическое значение.
        /// </summary>
        BoolVal,

        /// <summary>
        /// Гуид.
        /// </summary>
        GuidVal,

        /// <summary>
        /// Дробное число.
        /// </summary>
        DecimalVal,

        /// <summary>
        /// Дата.
        /// </summary>
        DateTimeVal,
    }
}
