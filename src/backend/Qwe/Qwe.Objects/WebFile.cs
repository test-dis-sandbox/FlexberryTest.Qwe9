namespace Qwe
{
    using System;
    using System.Text;
    using System.Text.Json;
    using ICSSoft.STORMNET;
    using ICSSoft.STORMNET.Business;

    /// <summary>
    /// Структура для хранения файлов в Web-приложении.
    /// </summary>
    [Serializable]
    [StoreInstancesInType(typeof(SQLDataService), typeof(string))]
    public class WebFile : IComparableType
    {
        /// <summary>
        /// Название файла.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Url для скачивания файла.
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// Инициализирует новый экземпляр <see cref="WebFile"/>.
        /// </summary>
        public WebFile()
        {
        }

        public static explicit operator string(WebFile value)
        {
            string json = JsonSerializer.Serialize(value);
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(json));
        }

        public static explicit operator WebFile(string value)
        {
            string json = Encoding.UTF8.GetString(Convert.FromBase64String(value));
            return JsonSerializer.Deserialize<WebFile>(json);
        }

        /// <inheritdoc/>
        public int Compare(object x)
        {
            if (x == null || x is not WebFile other)
            {
                return -1;
            }

            if (other.Url == null && Url == null)
            {
                return string.Compare(other.Name, Name, StringComparison.Ordinal);
            }

            return string.Compare(other.Url, Url, StringComparison.Ordinal);
        }

        /// <inheritdoc/>
        public override string ToString()
        {
            return Name;
        }
    }
}
