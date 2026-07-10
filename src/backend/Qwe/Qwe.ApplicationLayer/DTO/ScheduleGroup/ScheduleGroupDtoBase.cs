namespace Qwe.ApplicationLayer.DTO.ScheduleGroup
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для ScheduleGroup.
    /// </summary>
    public class ScheduleGroupDtoBase
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
        public virtual ScheduleGroupDtoBase FillFromClass(ScheduleGroup source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(ScheduleGroup destination)
        {
            throw new NotImplementedException();
        }
    }
}
