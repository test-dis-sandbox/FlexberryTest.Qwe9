namespace Qwe.ApplicationLayer.DTO.Group
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Group.
    /// </summary>
    public class GroupDtoBase
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
        public virtual GroupDtoBase FillFromClass(Group source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Group destination)
        {
            throw new NotImplementedException();
        }
    }
}
