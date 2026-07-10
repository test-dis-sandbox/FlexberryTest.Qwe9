namespace Qwe.ApplicationLayer.DTO.Faculty
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Faculty.
    /// </summary>
    public class FacultyDtoBase
    {
        /// <summary>
        /// Id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Заполняет ДТО данными из переданного объекта.
        /// </summary>
        /// <param name="source">Объект с данными.</param>
        /// <returns>Полученное ДТО.</returns>
        public virtual FacultyDtoBase FillFromClass(Faculty source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Faculty destination)
        {
            throw new NotImplementedException();
        }
    }
}
