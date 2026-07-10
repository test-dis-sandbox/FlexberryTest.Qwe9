namespace Qwe.ApplicationLayer.Attributes
{
    using System;
    using System.Linq;
    using ICSSoft.STORMNET;

    /// <summary>
    /// Атрибут для указания соответствия DTO определённому представлению (View) бизнес-сущности.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, Inherited = false)]
    public class DataViewAttribute : Attribute
    {
        /// <summary>
        /// Инициализирует новый экземпляр атрибута <see cref="DataViewAttribute"/>,
        /// связывающий DTO с заданной сущностью и её представлением.
        /// </summary>
        /// <param name="entityType">Тип бизнес-сущности, к которой относится DTO.</param>
        /// <param name="viewName">Имя представления (View) в STORM.NET для загрузки полей.</param>
        public DataViewAttribute(Type entityType, string viewName)
        {
            EntityType = entityType;
            ViewName = viewName;
        }

        /// <summary>
        /// Тип бизнес-сущности, для которой определено представление.
        /// </summary>
        public Type EntityType { get; }

        /// <summary>
        /// Имя представления (View) в ICSSoft.STORMNET, используемого для загрузки данных.
        /// </summary>
        public string ViewName { get; }

        /// <summary>
        /// Получает STORM.NET представление для указанного типа DTO.
        /// </summary>
        /// <typeparam name="TDto">Тип DTO с атрибутом DataViewAttribute.</typeparam>
        /// <returns>Представление STORM.NET.</returns>
        public static View GetView<TDto>()
        {
            var attr = typeof(TDto).GetCustomAttributes(typeof(DataViewAttribute), false)
                 .Cast<DataViewAttribute>()
                 .FirstOrDefault();

            if (attr == null)
            {
                throw new InvalidOperationException($"Тип DTO {typeof(TDto).Name} должен быть помечен атрибутом DataViewAttribute.");
            }

            View view = Information.GetView(attr.ViewName, attr.EntityType);
            if (view == null)
            {
                throw new InvalidOperationException($"Не удалось получить представление '{attr.ViewName}' для типа {attr.EntityType.Name}.");
            }

            return view;
        }
    }
}
