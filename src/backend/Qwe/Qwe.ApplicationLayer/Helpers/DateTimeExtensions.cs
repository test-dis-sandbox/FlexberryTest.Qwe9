namespace Qwe.ApplicationLayer.Helpers
{
    using System;

    /// <summary>
    /// Содержит методы расширения для преобразования DateTime в UTC-время.
    /// </summary>
    public static class DateTimeExtensions
    {
        /// <summary>
        /// Преобразует nullable DateTime в UTC-время.
        /// Если исходное значение null - возвращает null.
        /// Явно устанавливает Kind = DateTimeKind.Utc перед конвертацией.
        /// </summary>
        /// <param name="dt">Исходное дата-время (может быть null).</param>
        /// <returns>
        /// Преобразованное в UTC время или null, если исходное значение было null.
        /// </returns>
        public static DateTime? ToUniversalTime(this DateTime? dt)
            => dt.HasValue
            ? DateTime.SpecifyKind(dt.Value, DateTimeKind.Utc).ToUniversalTime()
            : null;

        /// <summary>
        /// Преобразует DateTime в UTC-время.
        /// Явно устанавливает Kind = DateTimeKind.Utc перед конвертацией.
        /// </summary>
        /// <param name="dt">Исходное дата-время для преобразования.</param>
        /// <returns>
        /// Преобразованное в UTC время с Kind = DateTimeKind.Utc.
        /// </returns>
        public static DateTime ToUniversalTime(this DateTime dt)
            => DateTime.SpecifyKind(dt, DateTimeKind.Utc).ToUniversalTime();

        /// <summary>
        /// Преобразует nullable DateTime в nullable DateOnly.
        /// Если исходное значение null - возвращает null.
        /// </summary>
        /// <param name="dateTime">Исходное дата-время (может быть null).</param>
        /// <returns>
        /// Преобразованный DateOnly или null, если исходное значение было null.
        /// </returns>
        public static DateOnly? ToDateOnly(this DateTime? dateTime)
            => dateTime.HasValue ? DateOnly.FromDateTime(dateTime.Value) : null;

        /// <summary>
        /// Преобразует DateTime в DateOnly.
        /// </summary>
        /// <param name="dateTime">Исходное дата-время.</param>
        /// <returns>
        /// Преобразованный DateOnly.
        /// </returns>
        public static DateOnly ToDateOnly(this DateTime dateTime)
            => DateOnly.FromDateTime(dateTime);
    }
}
