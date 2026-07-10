namespace Qwe.ApplicationLayer.Helpers
{
    using Microsoft.AspNetCore.StaticFiles;

    /// <summary>
    /// Вспомогательный класс для работы с MIME-типами файлов.
    /// </summary>
    public static class MimeTypeUtils
    {
        private static readonly FileExtensionContentTypeProvider FileExtensionContentTypeProvider = new ();

        /// <summary>
        /// Определяет MIME-тип файла на основе его расширения.
        /// </summary>
        /// <param name="subpath">Путь к файлу.</param>
        /// <returns>MIME-тип файла.</returns>
        public static string GetFileMimeType(string subpath)
        {
            FileExtensionContentTypeProvider.TryGetContentType(subpath, out string text);
            return text ?? "application/octet-stream";
        }
    }

}
