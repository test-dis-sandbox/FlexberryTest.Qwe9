namespace Qwe.ApplicationLayer.Services
{
    using System;
    using NewPlatform.Flexberry.ORM.CurrentUserService;

    /// <summary>
    /// Интерфейс работы с текущим пользователем.
    /// </summary>
    public interface IQweCurrentUserService : ICurrentUser
    {
        /// <summary>
        /// Идентификатор текущего пользователя.
        /// </summary>
        public Guid? UserId { get; }

        /// <summary>
        /// Почта текущего пользователя.
        /// </summary>
        public string? Email { get; }

        /// <summary>
        /// Флаг аутентификации пользователя.
        /// </summary>
        public bool IsAuthenticated { get; }
    }
}
