namespace Qwe.ApplicationLayer.DTO
{
    /// <summary>
    /// DTO с информацией о блокировке объекта.
    /// </summary>
    public class LockDataDto
    {
        /// <summary>
        /// Есть ли доступ к объекту.
        /// </summary>
        public bool Access { get; set; }

        /// <summary>
        /// Email пользователя, заблокировавшего форму.
        /// </summary>
        public string? UserEmail { get; set; }

        /// <summary>
        /// Имя пользователя.
        /// </summary>
        public string? Name { get; set; }

        public LockDataDto(bool access, string userEmail, string name)
        {
            Access = access;
            UserEmail = userEmail;
            Name = name;
        }
    }
}
