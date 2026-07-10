namespace Qwe.WebAPI
{
    using System;
    using System.Text;
    using ICSSoft.Services;
    using ICSSoft.STORMNET;
    using ICSSoft.STORMNET.Business;
    using ICSSoft.STORMNET.Business.Audit;
    using ICSSoft.STORMNET.Business.Interfaces;
    using ICSSoft.STORMNET.Security;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.OpenApi.Models;
    using NewPlatform.Flexberry.ORM.CurrentUserService;
    using NewPlatform.Flexberry.Services;
    using Swashbuckle.AspNetCore.SwaggerUI;
    using Unity;
    using Unity.Lifetime;
    using Qwe.ApplicationLayer.DTO.Department;
    using Qwe.ApplicationLayer.DTO.Faculty;
    using Qwe.ApplicationLayer.DTO.Group;
    using Qwe.ApplicationLayer.DTO.Schedule;
    using Qwe.ApplicationLayer.DTO.Student;
    using Qwe.ApplicationLayer.DTO.StudyPlan;
    using Qwe.ApplicationLayer.DTO.Teacher;
    using Qwe.ApplicationLayer.ExportProviders;
    using Qwe.ApplicationLayer.Helpers;
    using Qwe.ApplicationLayer.Services;
    using Qwe.WebAPI.Utils;

    /// <summary>
    /// Класс настройки запуска приложения.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup" /> class.
        /// </summary>
        /// <param name="configuration">An application configuration properties.</param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// An application configuration properties.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// Configurate the HTTP request pipeline.
        /// </summary>
        /// <remarks>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </remarks>
        /// <param name="app">An application configurator.</param>
        /// <param name="env">Information about web hosting environment.</param>
        /// <param name="config">Application configuration.</param>
        public static void Configure(IApplicationBuilder app, IWebHostEnvironment env, IConfiguration config)
        {
            LogService.LogInfo("Инициирован запуск приложения.");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseSwagger();

                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Qwe API v1");
                    options.RoutePrefix = string.Empty;
                    options.DocExpansion(DocExpansion.None);
                });
            }

            app.UseRouting();

            app.UseCors(builder =>
            {
                builder.AllowAnyHeader();
                builder.AllowAnyMethod();
                builder.AllowCredentials();
                builder.SetIsOriginAllowed(hostName => true);
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHealthChecks("/health");
            });
        }

        /// <summary>
        /// Configurate application services.
        /// </summary>
        /// <remarks>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </remarks>
        /// <param name="services">An collection of application services.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            string connStr = Configuration["DefConnStr"];

            services.AddMvcCore().AddApiExplorer();
            services.AddCors();
            services.AddHealthChecks().AddNpgSql(connStr);

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Qwe API",
                });

                string xmlFile = System.IO.Path.ChangeExtension(System.Reflection.Assembly.GetExecutingAssembly().Location, ".xml");
                if (System.IO.File.Exists(xmlFile))
                {
                    options.IncludeXmlComments(xmlFile);
                }
            });
        }

        /// <summary>
        /// Configurate application container.
        /// </summary>
        /// <param name="container">Container to configure.</param>
        public void ConfigureContainer(IUnityContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException(nameof(container));
            }

            while (container.Parent != null)
            {
                container = container.Parent;
            }

            container.RegisterInstance(Configuration);
            RegisterOrmServices(container);

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            container.RegisterType<IAudienceService, AudienceService>();
            container.RegisterType<IDepartmentService, DepartmentService>();
            container.RegisterType<IFacultyService, FacultyService>();
            container.RegisterType<IGroupService, GroupService>();
            container.RegisterType<ILessonService, LessonService>();
            container.RegisterType<IScheduleService, ScheduleService>();
            container.RegisterType<IScheduleGroupService, ScheduleGroupService>();
            container.RegisterType<IStudentService, StudentService>();
            container.RegisterType<IStudentBrigadesService, StudentBrigadesService>();
            container.RegisterType<IStudyPlanService, StudyPlanService>();
            container.RegisterType<ITeacherService, TeacherService>();

            container.RegisterType<IExcelExportProvider<DepartmentDtoBase>, DepartmentLExportProvider>("DepartmentLExportProvider");
            container.RegisterType<IExcelExportProvider<FacultyDtoBase>, FacultyLExportProvider>("FacultyLExportProvider");
            container.RegisterType<IExcelExportProvider<GroupDtoBase>, GroupLExportProvider>("GroupLExportProvider");
            container.RegisterType<IExcelExportProvider<ScheduleDtoBase>, ScheduleLExportProvider>("ScheduleLExportProvider");
            container.RegisterType<IExcelExportProvider<StudentDtoBase>, StudentLExportProvider>("StudentLExportProvider");
            container.RegisterType<IExcelExportProvider<StudyPlanDtoBase>, StudyPlanLExportProvider>("StudyPlanLExportProvider");
            container.RegisterType<IExcelExportProvider<TeacherDtoBase>, TeacherLExportProvider>("TeacherLExportProvider");

            container.RegisterSingleton<IHttpContextAccessor, HttpContextAccessor>();
            container.RegisterSingleton<IUserSettingsService, UserSettingsService>();
            container.RegisterSingleton<ILockService, NewPlatform.Flexberry.Services.LockService>();
            container.RegisterType<IServiceProviderIsService, UnityServiceProviderIsService>(new ContainerControlledLifetimeManager());
            container.RegisterType<ServiceHelper>();

            QweCurrentUserService currentUserService = new (container.Resolve<IHttpContextAccessor>(), container.Resolve<IDataService>());

            container.RegisterInstance<IQweCurrentUserService>(currentUserService);
            container.RegisterInstance<ICurrentUser>(currentUserService);
        }

        /// <summary>
        /// Register ORM implementations.
        /// </summary>
        /// <param name="container">Container to register at.</param>
        private void RegisterOrmServices(IUnityContainer container)
        {
            string connStr = Configuration["DefConnStr"];

            if (string.IsNullOrEmpty(connStr))
            {
                throw new System.Configuration.ConfigurationErrorsException("DefConnStr is not specified in Configuration or environment variables.");
            }

            container.RegisterSingleton<ISecurityManager, EmptySecurityManager>();
            container.RegisterSingleton<IAuditService, EmptyAuditService>();
            container.RegisterFactory<IBusinessServerProvider>(o => new BusinessServerProvider(new UnityServiceProvider(o)), FactoryLifetime.Singleton);

            container.RegisterSingleton<IDataService, PostgresDataService>(
                Inject.Property(nameof(PostgresDataService.CustomizationString), connStr));
        }
    }
}
