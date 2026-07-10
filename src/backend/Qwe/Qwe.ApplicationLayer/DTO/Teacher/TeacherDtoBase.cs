namespace Qwe.ApplicationLayer.DTO.Teacher
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Teacher.
    /// </summary>
    public class TeacherDtoBase
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
        public virtual TeacherDtoBase FillFromClass(Teacher source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Teacher destination)
        {
            throw new NotImplementedException();
        }
    }
}
