namespace Qwe.ApplicationLayer.Mapping
{
    using System;
    using Qwe;
    using Qwe.ApplicationLayer.DTO.Teacher;

    /// <summary>
    /// Статический маппер для преобразования между сущностью <see cref="Teacher"/> и её DTO.
    /// </summary>
    public static class TeacherMapper
    {
        /// <summary>
        /// Преобразует <see cref="Teacher"/> в указанный DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="source">Исходная сущность.</param>
        /// <returns>Указанный DTO.</returns>
        public static TDto MapToDto<TDto>(this Teacher source)
            where TDto : TeacherDtoBase, new()
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            TDto result = new TDto();

            return (TDto)result.FillFromClass(source);
        }

        /// <summary>
        /// Обновляет поля сущности <see cref="Teacher"/> по данным из DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO.</typeparam>
        /// <param name="destination">Сущность, которую нужно обновить.</param>
        /// <param name="source">DTO с новыми значениями.</param>
        public static void UpdateFromDto<TDto>(this Teacher destination, TDto source)
            where TDto : TeacherDtoBase
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
