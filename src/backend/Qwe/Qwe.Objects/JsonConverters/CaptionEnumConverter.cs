namespace Qwe
{
    using System;
    using System.ComponentModel;
    using System.Globalization;
    using ICSSoft.STORMNET;

    /// <summary>
    /// Конвертер для преобразования строк в значения перечислений по атрибуту <see cref="CaptionAttribute"/>.
    /// </summary>
    public class CaptionEnumConverter : EnumConverter
    {
        private readonly Type _enumType;

        /// <summary>
        /// Инициализирует новый экземпляр <see cref="CaptionEnumConverter"/> для указанного типа перечисления.
        /// </summary>
        /// <param name="type">Тип перечисления, для которого нужен конвертер.</param>
        public CaptionEnumConverter(Type type)
            : base(type)
        {
            if (type == null)
            {
                throw new ArgumentNullException(nameof(type));
            }

            _enumType = type;
        }

        /// <summary>
        /// Преобразует указанное значение объекта в эквивалентный объект перечисления.
        /// Поддерживается преобразование по подписи (Caption), имени или числовому значению.
        /// </summary>
        /// <param name="context">Среда десериализации, предоставляющая дополнительные сведения.</param>
        /// <param name="culture">Культура, используемая при преобразовании (игнорируется).</param>
        /// <param name="value">Преобразуемое значение. Ожидается строка или другое представление.</param>
        /// <returns>
        /// Объект перечисления типа <see cref="_enumType"/>, соответствующий входному значению.
        /// </returns>
        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            if (value is string text)
            {
                if (string.IsNullOrWhiteSpace(text))
                {
                    throw new FormatException(
                        $"Пустая строка не может быть преобразована в перечисление '{_enumType.FullName}'.");
                }

                try
                {
                    object captionResult = EnumCaption.GetValueFor(text, _enumType);

                    if (captionResult != null)
                    {
                        return captionResult;
                    }
                }
                catch
                {
                    // Не удалось по Caption - продолжим стандартную логику.
                }
            }

            try
            {
                return base.ConvertFrom(context, culture, value);
            }
            catch (Exception ex)
            {
                throw new FormatException(
                    $"Не удалось преобразовать значение '{value}' в перечисление '{_enumType.FullName}'.", ex);
            }
        }
    }
}
