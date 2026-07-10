namespace Qwe.IntegrationTests
{
    using ICSSoft.Services;
    using ICSSoft.STORMNET.Business;
    using ICSSoft.STORMNET.Business.Audit;
    using ICSSoft.STORMNET.Business.Interfaces;
    using ICSSoft.STORMNET.Security;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Unity;

    public class Startup
    {
        public void ConfigureHost(IHostBuilder hostBuilder) =>
            hostBuilder
                .ConfigureHostConfiguration(builder => { builder.AddJsonFile("appsettings.json"); })
                .ConfigureAppConfiguration((context, builder) => { });

        public void ConfigureServices(IServiceCollection services, HostBuilderContext context)
        {
            string connStr = context.Configuration["DefConnStr"];
            string connSecurityStr = context.Configuration["SecurityConnStr"];

            services.AddSingleton<ISecurityManager, EmptySecurityManager>();
            services.AddSingleton<IAuditService, EmptyAuditService>();
            services.AddSingleton<IBusinessServerProvider>(sp => new BusinessServerProvider(sp));

            services.AddSingleton<IDataService, PostgresDataService>(f => new PostgresDataService(f.GetService<ISecurityManager>(), f.GetService<IAuditService>(), f.GetService<IBusinessServerProvider>()) { CustomizationString = connStr });

            IUnityContainer container = UnityFactory.GetContainer();

            container.RegisterType<ISecurityManager, EmptySecurityManager>();
        }
    }
}