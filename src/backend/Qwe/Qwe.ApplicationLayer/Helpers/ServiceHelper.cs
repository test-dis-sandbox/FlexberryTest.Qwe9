namespace Qwe.ApplicationLayer.Helpers
{
    using System;
    using System.Linq.Expressions;
    using ICSSoft.STORMNET;
    using ICSSoft.STORMNET.Business;
    using ICSSoft.STORMNET.FunctionalLanguage;

    /// <summary>
    /// Инструменты для сервисов.
    /// </summary>
    public class ServiceHelper
    {
        private readonly IDataService _dataService;

        /// <summary>
        /// Инструменты для сервисов.
        /// </summary>
        /// <param name="dataService">Сервис данных.</param>
        public ServiceHelper(IDataService dataService)
        {
            _dataService = dataService;
        }

        /// <summary>
        /// Проверить наличие зависимых объектов при удалении объектов.
        /// </summary>
        /// <typeparam name="TDeletedDataObjectType">Тип удаляемого объекта.</typeparam>
        /// <typeparam name="TRelatedDataObjectType">Тип зависимого объекта.</typeparam>
        /// <param name="id">ID удаляемого объекта.</param>
        /// <param name="propExpression">Выражение для поска зависимости.</param>
        /// <exception cref="InvalidOperationException">Сообщение об ошибке.</exception>
        public void CheckRelation<TDeletedDataObjectType, TRelatedDataObjectType>(Guid id, Expression<Func<TRelatedDataObjectType, object>> propExpression)
            where TDeletedDataObjectType : DataObject
            where TRelatedDataObjectType : DataObject
        {
            Type deletedDataObjectType = typeof(TDeletedDataObjectType);
            Type relatedDataObjectType = typeof(TRelatedDataObjectType);

            View view = new View() { DefineClassType = relatedDataObjectType };
            view.AddProperty(Information.ExtractPropertyPath<TRelatedDataObjectType>(propExpression));

            LoadingCustomizationStruct lcs = LoadingCustomizationStruct.GetSimpleStruct(relatedDataObjectType, view);
            lcs.LimitFunction = FunctionBuilder.BuildEquals(propExpression, id);
            int relatedObjectsCount = _dataService.GetObjectsCount(lcs);

            if (relatedObjectsCount > 0)
            {
                InvalidOperationException ex = new ($"Произошла ошибка при удалении {deletedDataObjectType.Name} с Id {id}. Удаляемый объект связан с {relatedDataObjectType.Name}.");
                throw ex;
            }
        }
    }
}
