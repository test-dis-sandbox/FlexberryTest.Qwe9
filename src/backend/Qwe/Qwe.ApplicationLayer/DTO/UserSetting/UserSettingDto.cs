namespace Qwe.ApplicationLayer.DTO
{
    using System;
    using System.Text.Json.Serialization;
    using Qwe.ApplicationLayer.Attributes;
    using Qwe.ApplicationLayer.Helpers;

    /// <summary>
    /// DTO для UserSetting.
    /// </summary>
    public class UserSettingDto
    {
        /// <summary>
        /// Инициализирует новый экземпляр <see cref="UserSettingDto"/>.
        /// </summary>
        public UserSettingDto()
        {
        }

        /// <summary>
        /// Инициализирует новый экземпляр <see cref="UserSettingDto"/>.
        /// </summary>
        /// <param name="settingName">Название настройки.</param>
        /// <param name="moduleName">Название модуля.</param>
        /// <param name="valueType">Тип значения, которое надо записать.</param>
        /// <param name="valueAsString">Значение в виде строки для записи.</param>
        public UserSettingDto(UserSettingNamesEnum settingName, string moduleName, UserSettingValueTypeEnum valueType, string valueAsString)
        {
            SettingName = settingName;
            ModuleName = moduleName;
            ValueAsString = valueAsString;
            ValueType = valueType;
        }

        /// <summary>
        /// Название настройки.
        /// </summary>
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [PropertyName("SettingName")]
        public UserSettingNamesEnum SettingName { get; set; }

        /// <summary>
        /// Название модуля.
        /// </summary>
        [PropertyName("ModuleName")]
        public string ModuleName { get; set; } = string.Empty;

        /// <summary>
        /// Тип значения.
        /// </summary>
        [JsonConverter(typeof(JsonStringEnumConverter))]
        [PropertyName("ValueType")]
        public UserSettingValueTypeEnum ValueType { get; set; } = UserSettingValueTypeEnum.StrVal;

        /// <summary>
        /// Значение в виде строки.
        /// </summary>
        [PropertyName("ValueAsString")]
        public string ValueAsString { get; set; } = string.Empty;

        /// <summary>
        /// Формирование <see cref="UserSettingDto"/> из полей <see cref="UserSetting"/>.
        /// </summary>
        /// <param name="settingName">Название настройки.</param>
        /// <param name="moduleName">Название модуля.</param>
        /// <param name="stringValue">Значение строкового типа.</param>
        /// <param name="textValue">Значение, текстового типа.</param>
        /// <param name="intValue">Значение целочисленного типа.</param>
        /// <param name="boolValue">Значение логического типа.</param>
        /// <param name="guidValue">Значение типа гуид.</param>
        /// <param name="decimalValue">Значение дробным числом.</param>
        /// <param name="dateTimeValue">Значение в виде даты.</param>
        /// <returns>Сформированная сущность, где только название типа и строковое представление.</returns>
        public static UserSettingDto FormValue(
            UserSettingNamesEnum settingName,
            string moduleName,
            string stringValue,
            string textValue,
            int? intValue,
            bool? boolValue,
            Guid? guidValue,
            decimal? decimalValue,
            DateTime? dateTimeValue)
        {
            if (string.IsNullOrWhiteSpace(moduleName))
            {
                throw new ArgumentNullException(nameof(moduleName));
            }

            // Поиск, какая из настроек ненулевая, с такой и формируется результат.
            if (stringValue != null)
            {
                return new UserSettingDto(settingName, moduleName, UserSettingValueTypeEnum.StrVal, stringValue);
            }

            if (textValue != null)
            {
                return new UserSettingDto(settingName, moduleName, UserSettingValueTypeEnum.TxtVal, textValue);
            }

            if (intValue != null)
            {
                return new UserSettingDto(settingName, moduleName, UserSettingValueTypeEnum.IntVal, intValue.Value.ToString());
            }

            if (boolValue != null)
            {
                return new UserSettingDto(settingName, moduleName, UserSettingValueTypeEnum.BoolVal, boolValue.Value.ToString());
            }

            if (guidValue != null)
            {
                return new UserSettingDto(settingName, moduleName, UserSettingValueTypeEnum.GuidVal, guidValue.Value.ToString());
            }

            if (decimalValue != null)
            {
                return new UserSettingDto(settingName, moduleName, UserSettingValueTypeEnum.DecimalVal, decimalValue.Value.ToString());
            }

            if (dateTimeValue != null)
            {
                return new UserSettingDto(settingName, moduleName, UserSettingValueTypeEnum.DateTimeVal, dateTimeValue.Value.ToUniversalTime().ToString());
            }

            return null;
        }
    }
}
