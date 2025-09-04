using Domain.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

// Tarea individual dentro de un tablero 
public class TaskItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BoardId { get; set; } = string.Empty;
    public string CreatedById { get; set; } = string.Empty;
    public string? AssignedToId { get; set; }
    
    public Domain.Enums.TaskStatus Status { get; set; } = Domain.Enums.TaskStatus.Todo;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    
    public DateTime? DueDate { get; set; }
    public List<string> Tags { get; set; } = new();
    
    // Para ordenamiento dentro de cada columna
    public int Position { get; set; }
    
    // Información de completado
    public bool IsCompleted { get; set; } = false;
    public DateTime? CompletedAt { get; set; }
    public string? CompletedBy { get; set; }
    
    // Archivos adjuntos (URLs)
    public List<string> Attachments { get; set; } = new();
}
