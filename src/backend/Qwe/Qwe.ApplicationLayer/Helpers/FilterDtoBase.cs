namespace Qwe.ApplicationLayer.DTO
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.Linq.Expressions;
    using System.Reflection;
    using ICSSoft.STORMNET.FunctionalLanguage;
    using ICSSoft.STORMNET.Windows.Forms;
    using Qwe.ApplicationLayer.Attributes;
    using Qwe.ApplicationLayer.Helpers;

    /// <summary>
    /// DTO для Document.
    /// </summary>
    public abstract class FilterDtoBase
    {
        /// <summary>
        /// Type of DTO for this filters.
        /// </summary>
        protected Type? DtoType { get; set; }

        /// <summary>
        /// Columns for column search (contains).
        /// </summary>
        public string? SearchColumns { get; set; }

        /// <summary>
        /// Columns for column search (equal).
        /// </summary>
        public string? SearchColumnsEq { get; set; }

        /// <summary>
        /// Columns for column search (date).
        /// </summary>
        public string? SearchColumnsDate { get; set; }

        /// <summary>
        /// Columns for column search (datetime).
        /// </summary>
        public string? SearchColumnsDateTime { get; set; }

        /// <summary>
        /// Text for column search.
        /// </summary>
        public string? SearchText { get; set; }

        /// <summary>
        /// Text for column search (datetime).
        /// </summary>
        public string? SearchDate { get; set; }

        /// <summary>
        /// Построить полное ограничение на основе DTO.
        /// </summary>
        /// <returns>Полученное ограничение.</returns>
        public Function? GetLimitFunction()
        {
            Function? filters = BuildFiltersFunction();

            Function? columnFilters = BuildColumnFilterFunction();

            if (filters != null && columnFilters != null)
            {
                return FunctionBuilder.BuildAnd(filters, columnFilters);
            }

            return filters ?? columnFilters;
        }

        /// <summary>
        /// Построить ограничение на основе свойств фильтрации DTO.
        /// </summary>
        /// <returns>Полученное ограничение.</returns>
        protected abstract Function? BuildFiltersFunction();

        /// <summary>
        /// Построение ограничения для поиска по колонкам.
        /// </summary>
        /// <returns>Построенное ограничение или null.</returns>
        protected virtual Function? BuildColumnFilterFunction()
        {
            if ((string.IsNullOrEmpty(SearchColumnsEq) && string.IsNullOrEmpty(SearchColumns) && string.IsNullOrEmpty(SearchColumnsDate) && string.IsNullOrEmpty(SearchColumnsDateTime)) || string.IsNullOrEmpty(SearchText))
            {
                return null;
            }

            List<Function> columnLimits = new ();
            string[] columns = SearchColumns?.Split(',') ?? Array.Empty<string>();

            foreach (string column in columns)
            {
                string realPropName = DtoType?.GetProperty(column)?.GetCustomAttribute<PropertyNameAttribute>()?.PropName ?? column;
                if (realPropName != null)
                {
                    columnLimits.Add(FunctionBuilder.BuildContains(realPropName, SearchText));
                }
            }

            columns = SearchColumnsEq?.Split(",") ?? Array.Empty<string>();
            if (columns.Length > 0 && double.TryParse(SearchText, out double searchNumber))
            {
                foreach (string column in columns)
                {
                    string realPropName = DtoType?.GetProperty(column)?.GetCustomAttribute<PropertyNameAttribute>()?.PropName ?? column;
                    if (realPropName != null)
                    {
                        columnLimits.Add(FunctionBuilder.BuildEquals(realPropName, searchNumber));
                    }
                }
            }

            columns = SearchColumnsDate?.Split(",") ?? Array.Empty<string>();
            CultureInfo culture = CultureInfo.GetCultureInfo("ru-RU", false);
            if (columns.Length > 0 && DateTime.TryParse(SearchText, culture, out DateTime textAsDate))
            {
                foreach (string column in columns)
                {
                    string realPropName = DtoType?.GetProperty(column)?.GetCustomAttribute<PropertyNameAttribute>()?.PropName ?? column;
                    if (realPropName != null)
                    {
                        ExternalLangDef langDef = ExternalLangDef.LanguageDef;
                        Function function = langDef.GetFunction(
                            langDef.funcEQ,
                            langDef.GetFunction(
                                langDef.funcOnlyDate,
                                new VariableDef(langDef.DateTimeType, realPropName)),
                            langDef.GetFunction(
                                langDef.funcOnlyDate,
                                textAsDate));
                        columnLimits.Add(function);
                    }
                }
            }

            columns = SearchColumnsDateTime?.Split(",") ?? Array.Empty<string>();
            if (columns.Length > 0 && DateTime.TryParse(SearchDate, null, DateTimeStyles.AdjustToUniversal, out textAsDate))
            {
                foreach (string column in columns)
                {
                    string realPropName = DtoType?.GetProperty(column)?.GetCustomAttribute<PropertyNameAttribute>()?.PropName ?? column;
                    if (realPropName != null)
                    {
                        ExternalLangDef langDef = ExternalLangDef.LanguageDef;
                        Function function = langDef.GetFunction(
                            langDef.funcBETWEEN,
                            new VariableDef(langDef.DateTimeType, realPropName),
                            textAsDate,
                            textAsDate.AddDays(1));
                        columnLimits.Add(function);
                    }
                }
            }

            if (columnLimits.Count > 0)
            {
                return FunctionBuilder.BuildOr(columnLimits);
            }

            return FunctionBuilder.BuildFalse();
        }

        /// <summary>
        /// Построение кастомного ограничения для указанной операции фильтрации.
        /// </summary>
        /// <typeparam name="T">Тип объекта.</typeparam>
        /// <param name="operation">Операция фильтрации.</param>
        /// <param name="propertyExpr">Лямбда для фильтруемого свойства объекта.</param>
        /// <param name="value">Значение свойства объекта.</param>
        /// <returns>Построенное ограничение или null.</returns>
        protected virtual Function? GetCustomFilterFunction<T>(FilterOperation operation, Expression<Func<T, object>> propertyExpr, object? value)
        {
            return null;
        }

        /// <summary>
        /// Построение ограничения для указанной операции фильтрации.
        /// </summary>
        /// <typeparam name="T">Тип объекта.</typeparam>
        /// <param name="operation">Операция фильтрации.</param>
        /// <param name="propertyExpr">Лямбда для фильтруемого свойства объекта.</param>
        /// <param name="value">Значение свойства объекта.</param>
        /// <returns>Построенное ограничение.</returns>
        protected Function GetFilterFunction<T>(FilterOperation operation, Expression<Func<T, object>> propertyExpr, object? value)
        {
            Function? customFunction = GetCustomFilterFunction(operation, propertyExpr, value);
            if (customFunction != null)
            {
                return customFunction;
            }

            switch (operation)
            {
                case FilterOperation.EqualDate:
                case FilterOperation.Equal:
                    return FunctionBuilder.BuildEquals(propertyExpr, value);
                case FilterOperation.NotEqual:
                    return FunctionBuilder.BuildNotEquals(propertyExpr, value);
                case FilterOperation.LesserThanDate:
                case FilterOperation.LesserThan:
                    return FunctionBuilder.BuildLess(propertyExpr, value);
                case FilterOperation.LesserThanOrEqual:
                    return FunctionBuilder.BuildLessOrEqual(propertyExpr, value);
                case FilterOperation.GreaterThanDate:
                case FilterOperation.GreaterThan:
                    return FunctionBuilder.BuildGreater(propertyExpr, value);
                case FilterOperation.GreaterThanOrEqual:
                    return FunctionBuilder.BuildGreaterOrEqual(propertyExpr, value);
                case FilterOperation.Contains:
                    return FunctionBuilder.BuildContains(propertyExpr, value as string);
                case FilterOperation.NotContains:
                    return FunctionBuilder.BuildNot(FunctionBuilder.BuildContains(propertyExpr, value as string));
                case FilterOperation.StartsWith:
                    return FunctionBuilder.BuildStartsWith(propertyExpr, value as string);
                case FilterOperation.EndsWith:
                    return FunctionBuilder.BuildEndsWith(propertyExpr, value as string);
                default:
                    throw new ArgumentException($"Операция ${operation} не реализована в методе GetFilterFunction");
            }
        }
    }
}