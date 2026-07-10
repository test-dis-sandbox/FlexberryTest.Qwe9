namespace Qwe.ApplicationLayer.DTO.File
{
    using System;

    /// <summary>
    /// Базовое DTO для Audience.
    /// </summary>
    public class FileDtoBase
    {
        /// <summary>
        /// Заполняет ДТО данными из переданного объекта.
        /// </summary>
        /// <param name="source">Объект с данными.</param>
        /// <returns>Полученное ДТО.</returns>
        public virtual FileDtoBase FillFromClass(WebFile source)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Заполняет переданный объект данными из ДТО.
        /// </summary>
        /// <param name="destination">Объект для обновления.</param>
        public virtual void UpdateFromDto(WebFile destination)
        {
            throw new NotImplementedException();
        }
    }
}
