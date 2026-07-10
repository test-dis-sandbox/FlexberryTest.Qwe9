namespace Qwe.ApplicationLayer.DTO.StudentBrigades
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для StudentBrigades.
    /// </summary>
    public class StudentBrigadesDtoBase
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
        public virtual StudentBrigadesDtoBase FillFromClass(StudentBrigades source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(StudentBrigades destination)
        {
            throw new NotImplementedException();
        }
    }
}
