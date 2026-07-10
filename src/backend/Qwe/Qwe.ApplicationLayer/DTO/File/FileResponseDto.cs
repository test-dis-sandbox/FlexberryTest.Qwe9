namespace Qwe.ApplicationLayer.DTO.File
{
    /// <summary>
    /// DTO для File.
    /// </summary>
    public partial class FileResponseDto : FileDtoBase
    {
        /// <summary>
        /// Инициализирует новый экземпляр <see cref="FileResponseDto"/>.
        /// </summary>
        public FileResponseDto()
        {
        }

        /// <summary>
        /// Инициализирует новый экземпляр <see cref="FileResponseDto"/>.
        /// </summary>
        /// <param name="source">Объект для заполнения значений.</param>
        public FileResponseDto(WebFile source)
        {
            FillFromClass(source);
        }

        /// <summary>
        /// Название.
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Url.
        /// </summary>
        public string Url { get; set; } = string.Empty;

        /// <inheritdoc/>
        public override FileResponseDto FillFromClass(WebFile source)
        {
            if (source == null)
            {
                throw new ArgumentNullException(nameof(source));
            }

            Name = source.Name;
            Url = source.Url;

            return this;
        }

        /// <inheritdoc/>
        public override void UpdateFromDto(WebFile destination)
        {
            if (destination == null)
            {
                throw new ArgumentNullException(nameof(destination));
            }

            destination.Name = Name;
            destination.Url = Url;
        }
    }
}
