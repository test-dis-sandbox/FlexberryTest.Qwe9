namespace Qwe.ApplicationLayer.Mapping
{
    using System;
    using Qwe;
    using Qwe.ApplicationLayer.DTO.Lesson;

    /// <summary>
    /// Статический маппер для преобразования между сущностью <see cref="Lesson"/> и её DTO.
    /// </summary>
    public static class LessonMapper
    {
        /// <summary>
        /// Преобразует <see cref="Lesson"/> в указанный DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="source">Исходная сущность.</param>
        /// <returns>Указанный DTO.</returns>
        public static TDto MapToDto<TDto>(this Lesson source)
            where TDto : LessonDtoBase, new()
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            TDto result = new TDto();

            return (TDto)result.FillFromClass(source);
        }

        /// <summary>
        /// Обновляет поля сущности <see cref="Lesson"/> по данным из DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="destination">Сущность, которую нужно обновить.</param>
        /// <param name="source">DTO с новыми значениями.</param>
        public static void UpdateFromDto<TDto>(this Lesson destination, TDto source)
            where TDto : LessonDtoBase
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            if (destination == null)
            {
                throw new ArgumentNullException(nameof(destination));
            }

            source.UpdateFromDto(destination);
        }
    }
}
