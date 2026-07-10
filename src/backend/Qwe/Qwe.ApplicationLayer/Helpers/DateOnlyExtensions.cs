namespace Qwe.ApplicationLayer.Helpers
{
    using System;

    /// <summary>
    /// Содержит методы расширения для работы с DateOnly.
    /// </summary>
    public static class DateOnlyExtensions
    {
        /// <summary>
        /// Преобразует nullable DateOnly в DateTime с указанным временем.
        /// Если исходное значение null - возвращает null.
        /// </summary>
        /// <param name="dateOnly">Исходная дата.</param>
        /// <param name="time">Время для объединения с датой.</param>
        /// <returns>
        /// Объединенные DateTime или null, если исходная дата была null.
        /// </returns>
        public static DateTime? ToDateTime(this DateOnly? dateOnly, TimeOnly time)
            => dateOnly?.ToDateTime(time);

        /// <summary>
        /// Преобразует nullable DateOnly в DateTime с началом дня (00:00:00).
        /// Если исходное значение null - возвращает null.
        /// </summary>
        /// <param name="dateOnly">Исходная дата.</param>
        /// <returns>
        /// DateTime с началом дня или null, если исходная дата была null.
        /// </returns>
        public static DateTime? ToDateTime(this DateOnly? dateOnly)
            => dateOnly?.ToDateTime(TimeOnly.MinValue);

        /// <summary>
        /// Преобразует DateOnly в DateTime с указанным временем.
        /// </summary>
        /// <param name="dateOnly">Исходная дата.</param>
        /// <param name="time">Время для объединения с датой.</param>
        /// <returns>
        /// Объединенные DateTime.
        /// </returns>
        public static DateTime ToDateTime(this DateOnly dateOnly, TimeOnly time)
            => dateOnly.ToDateTime(time);

        /// <summary>
        /// Преобразует DateOnly в DateTime с началом дня (00:00:00).
        /// </summary>
        /// <param name="dateOnly">Исходная дата.</param>
        /// <returns>
        /// DateTime с началом дня.
        /// </returns>
        public static DateTime ToDateTime(this DateOnly dateOnly)
            => dateOnly.ToDateTime(TimeOnly.MinValue);
    }
}
