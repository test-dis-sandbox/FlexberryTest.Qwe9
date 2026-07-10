namespace Qwe.ApplicationLayer.Services
{
    using System;
    using System.Linq;
    using System.Net;
    using ICSSoft.STORMNET;
    using ICSSoft.STORMNET.Business;
    using ICSSoft.STORMNET.Business.LINQProvider;
    using ICSSoft.STORMNET.FunctionalLanguage;
    using ICSSoft.STORMNET.Security;
    using Microsoft.AspNetCore.Http;

    /// <summary>
    /// Сервис работы с текущим пользователем.
    /// </summary>
    public class QweCurrentUserService : IQweCurrentUserService
    {
        /// <summary>
        /// Доступ к текущему контексту.
        /// </summary>
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// Сервис для вычитки данных.
        /// </summary>
        private readonly IDataService _dataService;

        /// <summary>
        /// Initializes a new instance of the <see cref="QweCurrentUserService"/> class.
        /// </summary>
        /// <param name="httpContextAccessor">Доступ к текущему контексту.</param>
        /// <param name="dataService">Сервис для вычитки данных.</param>
        public QweCurrentUserService(IHttpContextAccessor httpContextAccessor, IDataService dataService)
        {
            _httpContextAccessor = httpContextAccessor;
            _dataService = dataService;
        }

        /// <inheritdoc/>
        public Guid? UserId
        {
            get
            {
                if (!IsAuthenticated)
                {
                    return null;
                }

                return Guid.Parse("00000000-0000-0000-0000-000000000001");
            }
        }

        /// <inheritdoc/>
        public string? Login
        {
            get
            {
                if (!IsAuthenticated)
                {
                    return null;
                }

                return "defaultUserLogin";
            }

            set
            {
                throw new NotSupportedException("Изменение логина не поддерживается.");
            }
        }

        /// <inheritdoc/>
        public string? Domain
        {
            get
            {
                return null;
            }

            set
            {
                throw new NotSupportedException("Изменение домена не поддерживается.");
            }
        }

        /// <inheritdoc/>
        public string? FriendlyName
        {
            get
            {
                if (!IsAuthenticated)
                {
                    return null;
                }

                return "defaultUserFriendlyName";
            }

            set
            {
                throw new NotSupportedException("Изменение имени пользователя не поддерживается.");
            }
        }

        /// <inheritdoc/>
        public string? Email
        {
            get
            {
                if (!IsAuthenticated)
                {
                    return null;
                }

                return "defaultUser@mail.ru";
            }
        }

        /// <inheritdoc/>
        public bool IsAuthenticated => true;
    }
}
