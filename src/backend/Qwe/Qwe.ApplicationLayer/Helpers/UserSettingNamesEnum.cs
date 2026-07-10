namespace Qwe.ApplicationLayer.Helpers
{
    /// <summary>
    /// Возможные варианты имён используемых значений настроек пользователя.
    /// Используется для минификации количества опечаток возможных.
    /// </summary>
    public enum UserSettingNamesEnum
    {
        /// <summary>
        /// Ширина столбцов Olv.
        /// </summary>
        ColumnWidth,

        /// <summary>
        /// Видимость столбцов Olv.
        /// </summary>
        ColumnHidden,

        /// <summary>
        /// Количество записей на странице Olv.
        /// </summary>
        PerPage,

        /// <summary>
        /// Порядок столбцов в Olv.
        /// </summary>
        ColumnOrder,

        /// <summary>
        /// Сортировка столбцов в Olv.
        /// </summary>
        ColumnSort,

        /// <summary>
        /// Фильтрация по столбцам.
        /// </summary>
        ColumnFilter,
    }
}
