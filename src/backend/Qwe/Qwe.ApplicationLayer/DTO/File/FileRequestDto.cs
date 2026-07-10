namespace Qwe.ApplicationLayer.DTO.File
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// DTO для File.
    /// </summary>
    public partial class FileRequestDto : FileDtoBase
    {
        /// <summary>
        /// Инициализирует новый экземпляр <see cref="FileRequestDto"/>.
        /// </summary>
        public FileRequestDto()
        {
        }

        /// <summary>
        /// Инициализирует новый экземпляр <see cref="FileRequestDto"/>.
        /// </summary>
        /// <param name="source">Объект для заполнения значений.</param>
        public FileRequestDto(WebFile source)
        {
            FillFromClass(source);
        }

        /// <summary>
        /// Название.
        /// </summary>
        [Required]
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Url.
        /// </summary>
        [Required]
        public string Url { get; set; } = string.Empty;

        /// <inheritdoc/>
        public override FileRequestDto FillFromClass(WebFile source)
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
