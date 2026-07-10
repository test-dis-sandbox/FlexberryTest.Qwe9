namespace Qwe.ApplicationLayer.DTO.Student
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Student.
    /// </summary>
    public class StudentDtoBase
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
        public virtual StudentDtoBase FillFromClass(Student source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Student destination)
        {
            throw new NotImplementedException();
        }
    }
}
