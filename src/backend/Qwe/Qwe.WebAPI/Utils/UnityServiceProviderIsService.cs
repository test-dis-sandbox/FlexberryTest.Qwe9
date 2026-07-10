namespace Qwe.WebAPI.Utils
{
    using System;
    using Microsoft.Extensions.DependencyInjection;
    using Unity;

    /// <summary>
    /// Реализация IServiceProviderIsService для интеграции Swagger.
    /// Проверяет наличие сервисов через делегирование запроса в Unity-контейнер.
    /// </summary>
    public class UnityServiceProviderIsService : IServiceProviderIsService
    {
        private readonly IUnityContainer _container;

        /// <summary>
        /// Создает новый экземпляр <see cref="UnityServiceProviderIsService"/>.
        /// </summary>
        /// <param name="container">Экземпляр Unity-контейнера для проверки регистрации сервисов.</param>
        public UnityServiceProviderIsService(IUnityContainer container)
        {
            _container = container;
        }

        /// <summary>
        /// Определяет, зарегистрирован ли указанный тип сервиса в Unity-контейнере.
        /// </summary>
        /// <param name="serviceType">Тип сервиса для проверки.</param>
        /// <returns>true, если сервис зарегистрирован в контейнере, иначе false.</returns>
        public bool IsService(Type serviceType)
        {
            return _container.IsRegistered(serviceType);
        }
    }
}
