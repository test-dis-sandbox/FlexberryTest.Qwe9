namespace Qwe.ApplicationLayer.DTO.Schedule
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Schedule.
    /// </summary>
    public class ScheduleDtoBase
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
        public virtual ScheduleDtoBase FillFromClass(Schedule source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Schedule destination)
        {
            throw new NotImplementedException();
        }
    }
}
