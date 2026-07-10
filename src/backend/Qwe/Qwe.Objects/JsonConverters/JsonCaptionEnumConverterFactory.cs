namespace Qwe
{
    using System;
    using System.Text.Json;
    using System.Text.Json.Serialization;

    /// <summary>
    /// Фабрика для регистрации конвертера по описанию перечислений без указания обобщенного типа.
    /// </summary>
    public class JsonCaptionEnumConverterFactory : JsonConverterFactory
    {
        /// <summary>
        /// Определяет, может ли данный тип быть обработан фабрикой.
        /// Возвращает <c>true</c>, если <paramref name="typeToConvert"/> является Enum.
        /// </summary>
        /// <param name="typeToConvert">Тип, который нужно проверить.</param>
        /// <returns><c>true</c>, если тип является перечислением; иначе <c>false</c>.</returns>
        public override bool CanConvert(Type typeToConvert)
        {
            return typeToConvert != null && typeToConvert.IsEnum;
        }

        /// <summary>
        /// Создает экземпляр JsonConverter для указанного типа перечисления.
        /// </summary>
        /// <param name="typeToConvert">Тип перечисления.</param>
        /// <param name="options">Опции сериализации.</param>
        /// <returns>Инстанс JsonConverter для Enum.</returns>
        public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
        {
            if (typeToConvert is null)
            {
                throw new ArgumentNullException(nameof(typeToConvert));
            }

            Type converterType = typeof(JsonCaptionEnumConverter<>).MakeGenericType(typeToConvert);
            return (JsonConverter)Activator.CreateInstance(converterType) !;
        }
    }
}