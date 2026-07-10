namespace Qwe
{
    using System;
    using System.Collections.Concurrent;
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using ICSSoft.STORMNET;

    /// <summary>
    /// Конвертер JSON, который сериализует перечисление в его строковое описание и десериализует из описания обратно в значение перечисления.
    /// Поддерживает кэширование для повышения производительности.
    /// </summary>
    /// <typeparam name="T">Тип перечисления.</typeparam>
    public class JsonCaptionEnumConverter<T> : JsonConverter<T>
        where T : struct, Enum
    {
        private static readonly ConcurrentDictionary<T, string> _toDescription = new ();
        private static readonly ConcurrentDictionary<string, T> _fromDescription = new (StringComparer.OrdinalIgnoreCase);

        /// <summary>
        /// Сериализует значение перечисления в JSON в виде строки описания.
        /// </summary>
        /// <param name="writer">Писатель JSON.</param>
        /// <param name="value">Значение перечисления.</param>
        /// <param name="options">Опции сериализации.</param>
        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            if (writer is null)
            {
                throw new ArgumentNullException(nameof(writer));
            }

            string description = _toDescription.GetOrAdd(value, v => EnumCaption.GetCaptionFor(v) ?? v.ToString());
            writer.WriteStringValue(description);
        }

        /// <summary>
        /// Десериализует строку описания из JSON обратно в значение перечисления.
        /// </summary>
        /// <param name="reader">Читатель JSON.</param>
        /// <param name="typeToConvert">Тип конвертации.</param>
        /// <param name="options">Опции десериализации.</param>
        /// <returns>Значение перечисления.</returns>
        /// <exception cref="JsonException">Выбрасывается, если преобразовать описание в значение перечисления не удалось.</exception>
        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType != JsonTokenType.String)
            {
                throw new JsonException($"Ожидалась строка для преобразования в перечисление {typeof(T)}, но получен токен: {reader.TokenType}.");
            }

            string description = reader.GetString();
            if (string.IsNullOrWhiteSpace(description))
            {
                throw new JsonException($"Пустая строка не может быть преобразована в перечисление {typeof(T)}.");
            }

            try
            {
                return _fromDescription.GetOrAdd(description, desc =>
                {
                    T val = (T)EnumCaption.GetValueFor(desc, typeof(T));
                    return val;
                });
            }
            catch (Exception ex)
            {
                throw new JsonException($"Не удалось преобразовать описание '{description}' в перечисление {typeof(T)}.", ex);
            }
        }
    }
}