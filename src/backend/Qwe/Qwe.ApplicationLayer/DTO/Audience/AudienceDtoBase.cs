namespace Qwe.ApplicationLayer.DTO.Audience
{
    using System;
    using Qwe;

    /// <summary>
    /// Базовое DTO для Audience.
    /// </summary>
    public class AudienceDtoBase
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
        public virtual AudienceDtoBase FillFromClass(Audience source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(Audience destination)
        {
            throw new NotImplementedException();
        }
    }
}
