namespace Qwe.ApplicationLayer.ExportProviders
{
    using System.Threading.Tasks;
    using Qwe.ApplicationLayer.DTO;

    /// <summary>
    /// Интерфейс провайдера экспорта сущности в Excel.
    /// </summary>
    /// <typeparam name="TDtoBase">Базовый тип DTO, от которого наследуются все DTO экспортируемой сущности.</typeparam>
    public interface IExcelExportProvider<TDtoBase>
    {
        /// <summary>
        /// Gets доменное имя сущности.
        /// </summary>
        string EntityName { get; }

        /// <summary>
        /// Экспортирует данные в XLSX.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO, используемый для экспорта.</typeparam>
        /// <param name="columns">Массив имён видимых колонок (camelCase).</param>
        /// <param name="sorting">Параметры сортировки.</param>
        /// <param name="filter">Фильтр списка.</param>
        /// <returns>Байты XLSX-файла.</returns>
        Task<byte[]> ExportAsync<TDto>(string[] columns, string[] sorting, FilterDtoBase? filter)
            where TDto : TDtoBase, new();
    }
}
