namespace Qwe.WebAPI.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using ICSSoft.Services;
    using Microsoft.AspNetCore.Mvc;
    using Qwe.ApplicationLayer.DTO;
    using Qwe.ApplicationLayer.Helpers;
    using Qwe.ApplicationLayer.Services;

    /// <summary>
    /// Контроллер для UserSettings.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class UserSettingsController : ControllerBase
    {
        /// <summary>
        /// Идентификатор пользователя, которое используется как имя пользователя по умолчанию.
        /// </summary>
        private readonly Guid defaultUserName = Guid.Empty;

        /// <summary>
        /// Внутренняя инстанция сервиса пользовательских настроек.
        /// </summary>
        private readonly IUserSettingsService _userSettingsService;

        /// <summary>
        /// Сервис текущего пользователя.
        /// </summary>
        private readonly IQweCurrentUserService _currentUserService;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserSettingsController"/> class.
        /// </summary>
        /// <param name="userSettingsService">Инстанция сервиса пользовательских настроек.</param>
        /// <param name="currentUserService">Сервис текущего пользователя.</param>
        public UserSettingsController(IUserSettingsService userSettingsService, IQweCurrentUserService currentUserService)
        {
            _userSettingsService = userSettingsService;
            _currentUserService = currentUserService;
        }

        /// <summary>
        /// Получение указанных пользовательских настроек.
        /// </summary>
        /// <param name="moduleName">Имя модуля, для которого нужны настройки.</param>
        /// <param name="settingNames">Имена настроек.</param>
        /// <returns>Найденные пользовательские настройки.</returns>
        [HttpGet("{moduleName}")]
        public ActionResult<List<UserSettingDto>> GetUserSettings(
            [FromRoute] string moduleName,
            [FromQuery] List<UserSettingNamesEnum> settingNames)
        {
            Guid? userId = _currentUserService.UserId;
            if (userId == null || userId == Guid.Empty)
            {
                return Unauthorized(new { message = "Идентификатор пользователя не найден в токене." });
            }

            try
            {
                if (string.IsNullOrEmpty(moduleName))
                {
                    throw new ArgumentNullException(nameof(moduleName));
                }

                if (settingNames == null)
                {
                    throw new ArgumentNullException(nameof(settingNames));
                }

                List<UserSettingDto> settings = new List<UserSettingDto>();
                settingNames.ForEach(setting =>
                {
                    UserSettingDto usDto = GetSetting(userId, moduleName, setting);
                    if (usDto == null)
                    {
                        // Попытка извлечь дефолтную настройку.
                        usDto = GetSetting(defaultUserName, moduleName, setting);
                    }

                    if (usDto != null)
                    {
                        settings.Add(usDto);
                    }
                });

                return Ok(settings);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Удаление пользовательских настроек для указанного модуля.
        /// </summary>
        /// <param name="moduleName">Имя модуля, для которого нужно удалить пользовательские настройки.</param>
        /// <returns>Результат выполнения операции.</returns>
        [HttpPost("deleteall")]
        public IActionResult DeleteAllUserSettings([FromBody] string moduleName)
        {
            Guid? userId = _currentUserService.UserId;
            if (userId == null || userId == Guid.Empty)
            {
                return Unauthorized(new { message = "Идентификатор пользователя не найден в токене." });
            }

            try
            {
                if (string.IsNullOrEmpty(moduleName))
                {
                    throw new ArgumentNullException(nameof(moduleName));
                }

                bool result = _userSettingsService.DeleteSettings(null, userId, moduleName, null, null, null);
                if (result)
                {
                    return Ok();
                }

                throw new InvalidOperationException("Настройки не были удалены.");
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Сохранение пользовательской настройки в БД.
        /// </summary>
        /// <param name="userSetting">Настройки для сохранения.</param>
        /// <returns>NoContent или сообщение об ошибке.</returns>
        [HttpPut("")]
        public IActionResult UpdateUserSetting([FromBody] UserSettingDto userSetting)
        {
            if (userSetting == null)
            {
                return BadRequest();
            }

            Guid? userId = _currentUserService.UserId;
            if (userId == null || userId == Guid.Empty)
            {
                return Unauthorized(new { message = "Идентификатор пользователя не найден в токене." });
            }

            try
            {
                WriteSetting(userSetting, userId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Сохранение пользовательской настройки в БД.
        /// </summary>
        /// <param name="userSettings">Настройки для сохранения.</param>
        /// <returns>NoContent или сообщение об ошибке.</returns>
        [HttpPut("setdefault")]
        public IActionResult SetDefaultUserSetting([FromBody] List<UserSettingDto> userSettings)
        {
            if (userSettings == null)
            {
                return BadRequest();
            }

            Guid? userId = _currentUserService.UserId;
            if (userId == null || userId == Guid.Empty)
            {
                // Не каждый пользователь должен иметь возможность задавать настройки по умолчанию. Позднее надо добавить проверку прав.
                return Unauthorized(new { message = "Идентификатор пользователя не найден в токене." });
            }

            int usCount = userSettings.Count;
            List<int> problemList = new List<int>();

            for (int i = 0; i < usCount; i++)
            {
                UserSettingDto userSetting = userSettings[i];
                try
                {
                    WriteSetting(userSetting, defaultUserName);
                }
                catch (Exception ex)
                {
                    problemList.Add(i);
                }
            }

            if (problemList.Any())
            {
                if (problemList.Count == usCount)
                {
                    return BadRequest(new { message = "Не удалось сохранить все настройки." });
                }

                return BadRequest(new { message = "Не удалось сохранить часть настроек." });
            }

            return Ok();
        }

        /// <summary>
        /// Получение настройки из сервиса.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <param name="moduleName">Название модуля.</param>
        /// <param name="setting">Название настройки.</param>
        /// <returns>Найденная настройка или <c>null</c>.</returns>
        private UserSettingDto GetSetting(Guid? userId, string moduleName, UserSettingNamesEnum setting)
        {
            bool settingWasGot = _userSettingsService.GetSettings(
                        null,
                        userId,
                        moduleName,
                        null,
                        setting.ToString(),
                        null,
                        out string stringValue,
                        out string textValue,
                        out int? intValue,
                        out bool? boolValue,
                        out Guid? guidValue,
                        out decimal? decimalValue,
                        out DateTime? dateTimeValue);
            if (settingWasGot)
            {
                return UserSettingDto.FormValue(setting, moduleName, stringValue, textValue, intValue, boolValue, guidValue, decimalValue, dateTimeValue);
            }

            return null;
        }

        /// <summary>
        /// Сохранение настройки в БД.
        /// </summary>
        /// <param name="userSetting">DTO настройки пользователя.</param>
        /// <param name="userId">Идентификатор пользователя, для которого надо написать настройку.</param>
        private void WriteSetting(UserSettingDto userSetting, Guid? userId)
        {
            string valueAsString = userSetting.ValueAsString;
            string moduleName = userSetting.ModuleName;
            string settingName = userSetting.SettingName.ToString();

            if (string.IsNullOrEmpty(valueAsString) || string.IsNullOrEmpty(moduleName))
            {
                throw new ArgumentException("Одно из переданных полей пустое.");
            }

            UserSettingValueTypeEnum usValueType = userSetting.ValueType;
            bool result = false;
            switch (usValueType)
            {
                case UserSettingValueTypeEnum.StrVal:
                    result = _userSettingsService.SetSettings(null, userId, moduleName, null, settingName, null, valueAsString, null, null, null, null, null, null);
                    break;
                case UserSettingValueTypeEnum.TxtVal:
                    result = _userSettingsService.SetSettings(null, userId, moduleName, null, settingName, null, null, valueAsString, null, null, null, null, null);
                    break;
                case UserSettingValueTypeEnum.IntVal:
                    if (!int.TryParse(valueAsString, out int valueAsInt))
                    {
                        throw new ArgumentOutOfRangeException($"Не удалось преобразовать {valueAsString} к целочисленному типу.");
                    }

                    result = _userSettingsService.SetSettings(null, userId, moduleName, null, settingName, null, null, null, valueAsInt, null, null, null, null);
                    break;
                case UserSettingValueTypeEnum.BoolVal:
                    if (!bool.TryParse(valueAsString, out bool valueAsBool))
                    {
                        throw new ArgumentOutOfRangeException($"Не удалось преобразовать {valueAsString} к логическому типу.");
                    }

                    result = _userSettingsService.SetSettings(null, userId, moduleName, null, settingName, null, null, null, null, valueAsBool, null, null, null);
                    break;
                case UserSettingValueTypeEnum.GuidVal:
                    if (!Guid.TryParse(valueAsString, out Guid valueAsGuid))
                    {
                        throw new ArgumentOutOfRangeException($"Не удалось преобразовать {valueAsString} к типу гуид.");
                    }

                    result = _userSettingsService.SetSettings(null, userId, moduleName, null, settingName, null, null, null, null, null, valueAsGuid, null, null);
                    break;
                case UserSettingValueTypeEnum.DecimalVal:
                    if (!decimal.TryParse(valueAsString, out decimal valueAsDecimal))
                    {
                        throw new ArgumentOutOfRangeException($"Не удалось преобразовать {valueAsString} к дробному числу.");
                    }

                    result = _userSettingsService.SetSettings(null, userId, moduleName, null, settingName, null, null, null, null, null, null, valueAsDecimal, null);
                    break;
                case UserSettingValueTypeEnum.DateTimeVal:
                    if (!DateTime.TryParse(valueAsString, out DateTime valueAsDatetime))
                    {
                        throw new ArgumentOutOfRangeException($"Не удалось преобразовать {valueAsString} к дате.");
                    }

                    result = _userSettingsService.SetSettings(null, userId, moduleName, null, settingName, null, null, null, null, null, null, null, valueAsDatetime);
                    break;
            }

            if (!result)
            {
                throw new InvalidOperationException("Настройка не была сохранена.");
            }
        }
    }
}
