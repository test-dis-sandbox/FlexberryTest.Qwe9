namespace Qwe.WebAPI.Controllers
{
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using NewPlatform.Flexberry.Services;
    using Qwe.ApplicationLayer.DTO;
    using Qwe.ApplicationLayer.Services;

    /// <summary>
    /// Контроллер блокировок.
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class LockController : ControllerBase
    {
        private readonly ILockService _lockService;

        private readonly IQweCurrentUserService _currentUser;

        /// <summary>
        /// Инициализирует новый экземпляр <see cref="LockController"/>.
        /// </summary>
        /// <param name="lockService">Сервис блокировок.</param>
        /// <param name="currentUser">Сервис текущего пользователя.</param>
        public LockController(ILockService lockService, IQweCurrentUserService currentUser)
        {
            _lockService = lockService;
            _currentUser = currentUser;
        }

        /// <summary>
        /// Заблокировать объект по его Id.
        /// </summary>
        /// <param name="dataObjectId">Id.</param>
        /// <returns><c>true</c> - заблокировался, иначе - <c>false</c>.</returns>
        [HttpPut("{dataObjectId}")]
        public async Task<ActionResult<LockDataDto>> Lock(string dataObjectId)
        {
            string userId = _currentUser.UserId?.ToString();

            if (userId == null)
            {
                return BadRequest();
            }

            LockData lockData = _lockService.LockObject(dataObjectId, userId);
            LockDataDto lockDataDto = new (lockData.Acquired, null, lockData.UseName ?? null);

            return Ok(lockDataDto);
        }

        /// <summary>
        /// Разблокировать объект по его Id.
        /// </summary>
        /// <param name="dataObjectId">Id.</param>
        /// <returns><c>true</c> - разблокировался, иначе - <c>false</c>.</returns>
        [HttpPost("{dataObjectId}")]
        public IActionResult UnLock(string dataObjectId)
        {
            LockData lockData = _lockService.GetLock(dataObjectId);
            string userId = _currentUser.UserId?.ToString();

            if (!lockData.Acquired || userId == lockData.UseName)
            {
                // Разблокировать может или тот же пользователь, или если блокировка просрочилась.
                return Ok(_lockService.UnlockObject(dataObjectId));
            }

            return Ok(false);
        }

        /// <summary>
        /// Получить состояние блокировки обхъекта по его Id.
        /// </summary>
        /// <param name="dataObjectId">Id.</param>
        /// <returns>Состояние блокировки <see cref="LockData"></see>.</returns>
        [HttpGet("{dataObjectId}")]
        public ActionResult<LockData> Get(string dataObjectId)
        {
            return Ok(_lockService.GetLock(dataObjectId));
        }
    }
}
