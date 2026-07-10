namespace Qwe.ApplicationLayer.DTO.StudyPlan
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для StudyPlan.
    /// </summary>
    public class StudyPlanDtoBase
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
        public virtual StudyPlanDtoBase FillFromClass(StudyPlan source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(StudyPlan destination)
        {
            throw new NotImplementedException();
        }
    }
}
