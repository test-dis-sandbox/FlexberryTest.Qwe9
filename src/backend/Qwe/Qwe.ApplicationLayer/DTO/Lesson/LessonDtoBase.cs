namespace Qwe.ApplicationLayer.DTO.Lesson
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Lesson.
    /// </summary>
    public class LessonDtoBase
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
        public virtual LessonDtoBase FillFromClass(Lesson source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Lesson destination)
        {
            throw new NotImplementedException();
        }
    }
}
