namespace Qwe.ApplicationLayer.Attributes
{
    using System;

    /// <summary>
    /// Атрибут для установления заголовка свойства DTO.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, Inherited = false)]
    public class CaptionPropertyAttribute : Attribute
    {
        /// <summary>
        /// Инициализирует новый экземпляр атрибута <see cref="CaptionPropertyAttribute"/>.
        /// </summary>
        /// <param name="caption">Заголовок свойства.</param>
        public CaptionPropertyAttribute(string caption)
        {
            Caption = caption;
        }

        /// <summary>
        /// Заголовок свойства.
        /// </summary>
        public string Caption { get; }
    }
}
