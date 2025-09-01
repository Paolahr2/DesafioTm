using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

/// <summary>
/// Entidad Board - Representa un tablero Kanban en el sistema
/// Un tablero contiene múltiples tareas organizadas en columnas por estado
/// Implementa principios de POO para encapsular la lógica del tablero
/// </summary>
public class Board
{
    /// <summary>
    /// Identificador único del tablero en MongoDB
    /// </summary>
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Nombre descriptivo del tablero
    /// Debe ser único por usuario/organización
    /// </summary>
    [BsonElement("name")]
    [BsonRequired]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Descripción opcional del tablero
    /// Proporciona contexto sobre el propósito del tablero
    /// </summary>
    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// ID del usuario propietario del tablero
    /// El propietario tiene permisos completos sobre el tablero
    /// </summary>
    [BsonElement("owner_id")]
    [BsonRequired]
    public string OwnerId { get; set; } = string.Empty;

    /// <summary>
    /// Lista de IDs de usuarios que tienen acceso al tablero
    /// Permite colaboración entre múltiples usuarios
    /// </summary>
    [BsonElement("members")]
    public List<string> Members { get; set; } = new List<string>();

    /// <summary>
    /// Fecha y hora de creación del tablero
    /// </summary>
    [BsonElement("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fecha y hora de la última actualización
    /// </summary>
    [BsonElement("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Indica si el tablero está activo
    /// Los tableros inactivos son soft-deleted
    /// </summary>
    [BsonElement("is_active")]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Color del tablero para personalización visual
    /// </summary>
    [BsonElement("color")]
    public string Color { get; set; } = "#2563eb"; // Azul por defecto

    /// <summary>
    /// Constructor sin parámetros requerido por MongoDB Driver
    /// </summary>
    public Board() { }

    /// <summary>
    /// Constructor para crear un nuevo tablero
    /// Inicializa el tablero con datos válidos
    /// </summary>
    /// <param name="name">Nombre del tablero</param>
    /// <param name="ownerId">ID del usuario propietario</param>
    /// <param name="description">Descripción opcional</param>
    /// <param name="color">Color personalizado opcional</param>
    public Board(string name, string ownerId, string? description = null, string? color = null)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
        OwnerId = ownerId ?? throw new ArgumentNullException(nameof(ownerId));
        Description = description ?? string.Empty;
        Color = color ?? "#2563eb";
        
        // El propietario es automáticamente miembro del tablero
        Members = new List<string> { ownerId };
        
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        IsActive = true;
    }

    /// <summary>
    /// Actualiza la información básica del tablero
    /// Solo el propietario puede actualizar estas propiedades
    /// </summary>
    /// <param name="name">Nuevo nombre</param>
    /// <param name="description">Nueva descripción</param>
    /// <param name="color">Nuevo color</param>
    public void UpdateInfo(string name, string? description = null, string? color = null)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
        
        if (description != null)
            Description = description;
        
        if (color != null)
            Color = color;
        
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Agrega un nuevo miembro al tablero
    /// Verifica que el usuario no sea ya miembro
    /// </summary>
    /// <param name="userId">ID del usuario a agregar</param>
    public void AddMember(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            throw new ArgumentException("El ID del usuario no puede estar vacío", nameof(userId));

        if (!Members.Contains(userId))
        {
            Members.Add(userId);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    /// <summary>
    /// Remueve un miembro del tablero
    /// El propietario no puede ser removido
    /// </summary>
    /// <param name="userId">ID del usuario a remover</param>
    public void RemoveMember(string userId)
    {
        if (userId == OwnerId)
            throw new InvalidOperationException("El propietario no puede ser removido del tablero");

        if (Members.Remove(userId))
        {
            UpdatedAt = DateTime.UtcNow;
        }
    }

    /// <summary>
    /// Verifica si un usuario tiene acceso al tablero
    /// </summary>
    /// <param name="userId">ID del usuario a verificar</param>
    /// <returns>True si el usuario es miembro o propietario</returns>
    public bool HasAccess(string userId)
    {
        return Members.Contains(userId) || OwnerId == userId;
    }

    /// <summary>
    /// Verifica si un usuario es el propietario del tablero
    /// </summary>
    /// <param name="userId">ID del usuario a verificar</param>
    /// <returns>True si es el propietario</returns>
    public bool IsOwner(string userId)
    {
        return OwnerId == userId;
    }

    /// <summary>
    /// Desactiva el tablero (soft delete)
    /// Solo el propietario puede desactivar un tablero
    /// </summary>
    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Reactiva un tablero previamente desactivado
    /// </summary>
    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Transfiere la propiedad del tablero a otro usuario
    /// El nuevo propietario debe ser miembro del tablero
    /// </summary>
    /// <param name="newOwnerId">ID del nuevo propietario</param>
    public void TransferOwnership(string newOwnerId)
    {
        if (string.IsNullOrEmpty(newOwnerId))
            throw new ArgumentException("El ID del nuevo propietario no puede estar vacío", nameof(newOwnerId));

        if (!Members.Contains(newOwnerId))
            throw new InvalidOperationException("El nuevo propietario debe ser miembro del tablero");

        OwnerId = newOwnerId;
        UpdatedAt = DateTime.UtcNow;
    }
}
