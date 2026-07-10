namespace Qwe.ApplicationLayer.Helpers
{
    using System.ComponentModel;
    using System.Text.Json.Serialization;
    using ICSSoft.STORMNET;

    /// <summary>
    /// Операции фильтрации.
    /// </summary>
    [TypeConverter(typeof(CaptionEnumConverter))]
    [JsonConverter(typeof(JsonCaptionEnumConverterFactory))]
    public enum FilterOperation
    {
        [Caption("eqd")]
        EqualDate,

        [Caption("ltd")]
        LesserThanDate,

        [Caption("gtd")]
        GreaterThanDate,

        [Caption("eq")]
        Equal,

        [Caption("neq")]
        NotEqual,

        [Caption("lt")]
        LesserThan,

        [Caption("lte")]
        LesserThanOrEqual,

        [Caption("gt")]
        GreaterThan,

        [Caption("gte")]
        GreaterThanOrEqual,

        [Caption("contains")]
        Contains,

        [Caption("notContains")]
        NotContains,

        [Caption("startsWith")]
        StartsWith,

        [Caption("endsWith")]
        EndsWith,
    }
}
