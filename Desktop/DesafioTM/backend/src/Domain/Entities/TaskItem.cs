using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Domain.Enums;

namespace Domain.Entities;

/// <summary>
/// Entidad Task - Representa una tarea en el sistema Kanban
/// Esta clase encapsula toda la lógica de negocio relacionada con las tareas
/// siguiendo los principios SOLID y POO
/// </summary>
public class TaskItem
{
    /// <summary>
    /// Identificador único de la tarea en MongoDB
    /// </summary>
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Título descriptivo de la tarea
    /// Campo requerido para identificar la tarea
    /// </summary>
    [BsonElement("title")]
    [BsonRequired]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Descripción detallada de la tarea
    /// Proporciona contexto adicional sobre qué debe realizarse
    /// </summary>
    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Estado actual de la tarea en el flujo Kanban
    /// Determina en qué columna del tablero se muestra la tarea
    /// </summary>
    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public Domain.Enums.TaskStatus Status { get; set; } = Domain.Enums.TaskStatus.Todo;

    /// <summary>
    /// Prioridad de la tarea para ordenamiento y gestión
    /// </summary>
    [BsonElement("priority")]
    [BsonRepresentation(BsonType.String)]
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;

    /// <summary>
    /// ID del usuario que creó la tarea
    /// Mantiene la trazabilidad de quién creó cada tarea
    /// </summary>
    [BsonElement("created_by")]
    [BsonRequired]
    public string CreatedBy { get; set; } = string.Empty;

    /// <summary>
    /// ID del usuario asignado a la tarea
    /// Puede ser null si la tarea no está asignada
    /// </summary>
    [BsonElement("assigned_to")]
    public string? AssignedTo { get; set; }

    /// <summary>
    /// ID del tablero al que pertenece la tarea
    /// </summary>
    [BsonElement("board_id")]
    [BsonRequired]
    public string BoardId { get; set; } = string.Empty;

    /// <summary>
    /// Fecha límite para completar la tarea
    /// Opcional, permite gestión de deadlines
    /// </summary>
    [BsonElement("due_date")]
    public DateTime? DueDate { get; set; }

    /// <summary>
    /// Lista de etiquetas para categorizar la tarea
    /// Permite filtrado y organización adicional
    /// </summary>
    [BsonElement("tags")]
    public List<string> Tags { get; set; } = new List<string>();

    /// <summary>
    /// Fecha y hora de creación de la tarea
    /// </summary>
    [BsonElement("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fecha y hora de la última actualización
    /// </summary>
    [BsonElement("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Fecha y hora en que la tarea fue completada
    /// Solo se establece cuando el estado cambia a Completed
    /// </summary>
    [BsonElement("completed_at")]
    public DateTime? CompletedAt { get; set; }

    /// <summary>
    /// Posición de la tarea dentro de su columna/estado
    /// Permite ordenamiento personalizado en el tablero Kanban
    /// </summary>
    [BsonElement("position")]
    public int Position { get; set; } = 0;

    /// <summary>
    /// Constructor sin parámetros requerido por MongoDB Driver
    /// </summary>
    public TaskItem() { }

    /// <summary>
    /// Constructor para crear una nueva tarea con datos básicos
    /// Encapsula la creación con validaciones básicas
    /// </summary>
    /// <param name="title">Título de la tarea</param>
    /// <param name="createdBy">ID del usuario que crea la tarea</param>
    /// <param name="boardId">ID del tablero donde se crea la tarea</param>
    /// <param name="description">Descripción opcional</param>
    public TaskItem(string title, string createdBy, string boardId, string? description = null)
    {
        Title = title ?? throw new ArgumentNullException(nameof(title));
        CreatedBy = createdBy ?? throw new ArgumentNullException(nameof(createdBy));
        BoardId = boardId ?? throw new ArgumentNullException(nameof(boardId));
        Description = description ?? string.Empty;
        
        Status = Domain.Enums.TaskStatus.Todo;
        Priority = TaskPriority.Medium;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        Tags = new List<string>();
    }

    /// <summary>
    /// Actualiza la información básica de la tarea
    /// Regla de negocio: Las tareas completadas no se pueden editar
    /// </summary>
    /// <param name="title">Nuevo título</param>
    /// <param name="description">Nueva descripción</param>
    /// <param name="priority">Nueva prioridad</param>
    /// <param name="dueDate">Nueva fecha límite</param>
    public void UpdateInfo(string title, string? description = null, 
                          TaskPriority? priority = null, DateTime? dueDate = null)
    {
        // Regla de negocio: Las tareas completadas no se pueden editar
        if (Status == Domain.Enums.TaskStatus.Completed)
            throw new InvalidOperationException("No se pueden editar tareas completadas");

        Title = title ?? throw new ArgumentNullException(nameof(title));
        
        if (description != null)
            Description = description;
        
        if (priority.HasValue)
            Priority = priority.Value;
        
        DueDate = dueDate;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Cambia el estado de la tarea en el flujo Kanban
    /// Implementa reglas de negocio para transiciones válidas
    /// </summary>
    /// <param name="newStatus">Nuevo estado de la tarea</param>
    public void ChangeStatus(Domain.Enums.TaskStatus newStatus)
    {
        // Si se marca como completada, registrar la fecha
        if (newStatus == Domain.Enums.TaskStatus.Completed && Status != Domain.Enums.TaskStatus.Completed)
        {
            CompletedAt = DateTime.UtcNow;
        }
        
        // Si se cambia desde completada a otro estado, limpiar fecha de completado
        if (Status == Domain.Enums.TaskStatus.Completed && newStatus != Domain.Enums.TaskStatus.Completed)
        {
            CompletedAt = null;
        }

        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Asigna la tarea a un usuario específico
    /// </summary>
    /// <param name="userId">ID del usuario asignado</param>
    public void AssignTo(string userId)
    {
        AssignedTo = userId ?? throw new ArgumentNullException(nameof(userId));
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Desasigna la tarea de cualquier usuario
    /// </summary>
    public void Unassign()
    {
        AssignedTo = null;
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Agrega una etiqueta a la tarea
    /// </summary>
    /// <param name="tag">Etiqueta a agregar</param>
    public void AddTag(string tag)
    {
        if (string.IsNullOrWhiteSpace(tag))
            throw new ArgumentException("La etiqueta no puede estar vacía", nameof(tag));

        if (!Tags.Contains(tag, StringComparer.OrdinalIgnoreCase))
        {
            Tags.Add(tag.Trim());
            UpdatedAt = DateTime.UtcNow;
        }
    }

    /// <summary>
    /// Remueve una etiqueta de la tarea
    /// </summary>
    /// <param name="tag">Etiqueta a remover</param>
    public void RemoveTag(string tag)
    {
        var existingTag = Tags.FirstOrDefault(t => 
            string.Equals(t, tag, StringComparison.OrdinalIgnoreCase));
        
        if (existingTag != null)
        {
            Tags.Remove(existingTag);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    /// <summary>
    /// Actualiza la posición de la tarea en el tablero
    /// </summary>
    /// <param name="position">Nueva posición</param>
    public void UpdatePosition(int position)
    {
        Position = Math.Max(0, position);
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Verifica si el usuario puede eliminar esta tarea
    /// Regla de negocio: Solo el creador puede eliminar la tarea
    /// </summary>
    /// <param name="userId">ID del usuario que intenta eliminar</param>
    /// <returns>True si puede eliminar, false en caso contrario</returns>
    public bool CanBeDeletedBy(string userId)
    {
        return CreatedBy == userId;
    }

    /// <summary>
    /// Verifica si la tarea está vencida
    /// </summary>
    /// <returns>True si tiene fecha límite y está vencida</returns>
    public bool IsOverdue()
    {
        return DueDate.HasValue && DueDate.Value < DateTime.UtcNow && Status != Domain.Enums.TaskStatus.Completed;
    }
}
