using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

/// <summary>
/// Entidad User - Representa un usuario del sistema de gestión de tareas
/// Esta clase implementa los principios de POO encapsulando las propiedades del usuario
/// y las reglas de negocio asociadas
/// </summary>
public class User
{
    /// <summary>
    /// Identificador único del usuario en MongoDB
    /// Se mapea automáticamente al campo _id de MongoDB
    /// </summary>
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Nombre de usuario único para el login
    /// Campo requerido para la autenticación
    /// </summary>
    [BsonElement("username")]
    [BsonRequired]
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Correo electrónico del usuario
    /// Debe ser único en el sistema
    /// </summary>
    [BsonElement("email")]
    [BsonRequired]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Contraseña hasheada del usuario
    /// Nunca se almacena en texto plano por seguridad
    /// </summary>
    [BsonElement("password_hash")]
    [BsonRequired]
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Nombre completo del usuario para mostrar en la interfaz
    /// </summary>
    [BsonElement("full_name")]
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Fecha y hora de creación del usuario
    /// Se establece automáticamente al crear un nuevo usuario
    /// </summary>
    [BsonElement("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fecha y hora de la última actualización del usuario
    /// Se actualiza cada vez que se modifica el usuario
    /// </summary>
    [BsonElement("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Indica si el usuario está activo en el sistema
    /// Los usuarios inactivos no pueden acceder al sistema
    /// </summary>
    [BsonElement("is_active")]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Fecha y hora del último login del usuario
    /// Se actualiza cada vez que el usuario se autentica exitosamente
    /// </summary>
    [BsonElement("last_login_at")]
    public DateTime? LastLoginAt { get; set; }

    /// <summary>
    /// Constructor sin parámetros requerido por MongoDB Driver
    /// </summary>
    public User() { }

    /// <summary>
    /// Constructor para crear un nuevo usuario con los datos básicos
    /// Implementa el principio de encapsulación inicializando el objeto en un estado válido
    /// </summary>
    /// <param name="username">Nombre de usuario único</param>
    /// <param name="email">Correo electrónico único</param>
    /// <param name="passwordHash">Contraseña ya hasheada</param>
    /// <param name="fullName">Nombre completo del usuario</param>
    public User(string username, string email, string passwordHash, string fullName)
    {
        Username = username ?? throw new ArgumentNullException(nameof(username));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        PasswordHash = passwordHash ?? throw new ArgumentNullException(nameof(passwordHash));
        FullName = fullName ?? throw new ArgumentNullException(nameof(fullName));
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    /// <summary>
    /// Actualiza la información del usuario
    /// Método que encapsula la lógica de actualización manteniendo la integridad
    /// </summary>
    /// <param name="fullName">Nuevo nombre completo</param>
    /// <param name="email">Nuevo email (opcional)</param>
    public void UpdateInfo(string fullName, string? email = null)
    {
        FullName = fullName ?? throw new ArgumentNullException(nameof(fullName));
        
        if (!string.IsNullOrEmpty(email))
            Email = email;
        
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Desactiva el usuario en lugar de eliminarlo
    /// Implementa soft delete para mantener integridad referencial
    /// </summary>
    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Reactiva un usuario previamente desactivado
    /// </summary>
    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
