namespace Qwe.ApplicationLayer.DTO.Department
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Department.
    /// </summary>
    public class DepartmentDtoBase
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
        public virtual DepartmentDtoBase FillFromClass(Department source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Department destination)
        {
            throw new NotImplementedException();
        }
    }
}
