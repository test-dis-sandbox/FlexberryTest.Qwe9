namespace Qwe.ApplicationLayer.Attributes
{
    using System;

    /// <summary>
    /// Атрибут для установления соответствия между именем поля в DTO и именем поля в DataObject.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, Inherited = false)]
    public class PropertyNameAttribute : Attribute
    {
        /// <summary>
        /// Инициализирует новый экземпляр атрибута <see cref="PropertyNameAttribute"/>.
        /// </summary>
        /// <param name="name">Имя поля в DataObject.</param>
        public PropertyNameAttribute(string name)
        {
            PropName = name;
        }

        /// <summary>
        /// Имя поля в DataObject.
        /// </summary>
        public string PropName { get; }
    }
}
