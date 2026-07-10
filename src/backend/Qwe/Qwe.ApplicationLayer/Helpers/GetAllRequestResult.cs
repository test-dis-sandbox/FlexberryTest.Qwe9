namespace Qwe.ApplicationLayer.Helpers
{
    using System.Collections.Generic;

    /// <summary>
    /// Тип ответа для getAll запроса.
    /// </summary>
    /// <typeparam name="TDto">Тип DTO.</typeparam>
    public class GetAllRequestResult<TDto>
    {
        /// <summary>
        /// Общее число записей.
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        /// Вычитанные записи.
        /// </summary>
        public IEnumerable<TDto> Records { get; set; } = new List<TDto>();
    }
}
