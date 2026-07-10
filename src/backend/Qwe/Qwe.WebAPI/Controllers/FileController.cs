namespace Qwe.WebAPI.Controllers
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using ICSSoft.STORMNET;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Qwe.ApplicationLayer.DTO.File;
    using Qwe.ApplicationLayer.Helpers;
    using Qwe.ApplicationLayer.Services;

    /// <summary>
    /// Контроллер для File.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public partial class FileController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        private readonly IQweCurrentUserService _currentUserService;

        /// <summary>
        /// Инициализирует новый экземпляр <see cref="FileController"/>.
        /// </summary>
        /// <param name="configuration">Конфигурация приложения.</param>
        /// <param name="currentUserService">Сервис текущего пользователя.</param>
        public FileController(IConfiguration configuration, IQweCurrentUserService currentUserService)
        {
            _configuration = configuration;
            _currentUserService = currentUserService;
        }

        /// <summary>
        /// Сохранить файл в файловую систему.
        /// </summary>
        /// <param name="file">Загружаемый файл.</param>
        /// <returns>Созданный <see cref="FileResponseDto"/>.</returns>
        [HttpPost("Upload")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult<FileResponseDto>> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest();
            }

            try
            {
                string directoryPath = CreateFileUploadDirectory(out string uploadKey);
                string relativeStoragePath = Path.Combine(directoryPath, $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}");

                using (FileStream stream = System.IO.File.Create(Path.Combine(uploadKey, relativeStoragePath)))
                {
                    await file.CopyToAsync(stream);
                }

                FileResponseDto result = new ()
                {
                    Name = file.FileName,
                    Url = relativeStoragePath,
                };

                return Ok(result);
            }
            catch (System.UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                LogService.LogError("Ошибка при сохранение File", ex);

                return BadRequest();
            }
        }

        /// <summary>
        /// Скачать файл из файловой системы.
        /// </summary>
        /// <param name="dto">DTO с данными файла.</param>
        /// <returns>Файл для скачивания.</returns>
        [HttpPost("Download")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> Download([FromBody] FileRequestDto dto)
        {
            if (dto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem();
            }

            WebFile file = new();
            dto.UpdateFromDto(file);

            try
            {
                string filePath = GetFileFullPath(file);
                string fileMimeType = MimeTypeUtils.GetFileMimeType(filePath);

                return PhysicalFile(filePath, fileMimeType, file.Name);
            }
            catch (Exception ex) when (ex is ICSSoft.STORMNET.UnauthorizedAccessException or System.UnauthorizedAccessException)
            {
                return Forbid(ex.Message);
            }
            catch (FileNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                LogService.LogError("Ошибка при сохранение File", ex);

                return BadRequest();
            }
        }

        /// <summary>
        /// Получить абсолютный путь до файла.
        /// </summary>
        /// <param name="file">Файл.</param>
        /// <returns>Абсолютный путь к файлу.</returns>
        private string GetFileFullPath(WebFile file)
        {
            if (file == null)
            {
                throw new ArgumentNullException(nameof(file));
            }

            string uploadKey = _configuration["UploadUrl"];
            if (string.IsNullOrWhiteSpace(uploadKey))
            {
                throw new InvalidOperationException("Не удалось получить путь для загрузки файлов.");
            }

            string relativePath = Path.Combine(uploadKey, file.Url);
            string fullPath = Path.GetFullPath(relativePath);

            string fileUploadDirectory = Path.Combine(Environment.CurrentDirectory, uploadKey);
            if (!fullPath.StartsWith(fileUploadDirectory, StringComparison.Ordinal))
            {
                throw new System.UnauthorizedAccessException("Файл находится вне разрешенной директории.");
            }

            if (!System.IO.File.Exists(fullPath))
            {
                throw new FileNotFoundException();
            }

            return fullPath;
        }

        /// <summary>
        /// Создать директорию для загрузки файла.
        /// </summary>
        /// <param name="uploadKey">[out] Путь до папки с файлами.</param>
        /// <returns>Путь к созданной директории.</returns>
        private string CreateFileUploadDirectory(out string uploadKey)
        {
            string uploadKeyConfig = _configuration["UploadUrl"];
            if (string.IsNullOrWhiteSpace(uploadKeyConfig))
            {
                throw new InvalidOperationException("Не удалось получить путь для загрузки файлов.");
            }

            uploadKey = uploadKeyConfig;

            string userLogin = _currentUserService.Login;
            if (string.IsNullOrWhiteSpace(userLogin))
            {
                throw new System.UnauthorizedAccessException("Не удалось получить логин пользователя.");
            }

            string fileUploadDirectoryPath = Path.Combine(uploadKey, userLogin);
            if (!Directory.Exists(fileUploadDirectoryPath))
            {
                Directory.CreateDirectory(fileUploadDirectoryPath);
            }

            return userLogin;
        }
    }
}
