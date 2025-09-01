using Domain.Enums;

namespace Application.DTOs;

/// <summary>
/// DTO para solicitud de creación de usuario
/// Data Transfer Object que encapsula los datos necesarios para registrar un usuario
/// </summary>
public class CreateUserDto
{
    /// <summary>
    /// Nombre de usuario único
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// Correo electrónico del usuario
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Contraseña en texto plano (se hasheará en el servicio)
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Nombre completo del usuario
    /// </summary>
    public string FullName { get; set; } = string.Empty;
}

/// <summary>
/// DTO para respuesta de usuario
/// Excluye información sensible como passwords
/// </summary>
public class UserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; }
}

/// <summary>
/// DTO para actualización de usuario
/// </summary>
public class UpdateUserDto
{
    /// <summary>
    /// Nuevo nombre completo del usuario
    /// </summary>
    public string FullName { get; set; } = string.Empty;

    /// <summary>
    /// Nuevo email (opcional)
    /// </summary>
    public string? Email { get; set; }
}

/// <summary>
/// DTO para solicitud de creación de tarea
/// </summary>
public class CreateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BoardId { get; set; } = string.Empty;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public string? AssignedTo { get; set; }
    public DateTime? DueDate { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
}

/// <summary>
/// DTO para solicitud de creación de tarea con usuario creador
/// </summary>
public class CreateTaskRequestDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string BoardId { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public TaskPriority? Priority { get; set; }
    public string? AssignedTo { get; set; }
    public DateTime? DueDate { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
}

/// <summary>
/// DTO para actualización de tarea
/// </summary>
public class UpdateTaskDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskPriority? Priority { get; set; }
    public string? AssignedTo { get; set; }
    public DateTime? DueDate { get; set; }
}

/// <summary>
/// DTO para cambio de estado de tarea
/// </summary>
public class ChangeTaskStatusDto
{
    public Domain.Enums.TaskStatus NewStatus { get; set; }
}

/// <summary>
/// DTO para respuesta de tarea
/// </summary>
public class TaskResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Domain.Enums.TaskStatus Status { get; set; }
    public TaskPriority Priority { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string? AssignedTo { get; set; }
    public string BoardId { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public List<string> Tags { get; set; } = new List<string>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int Position { get; set; }
}

/// <summary>
/// DTO para solicitud de creación de tablero
/// </summary>
public class CreateBoardDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Color { get; set; } = "#2563eb";
}

/// <summary>
/// DTO para solicitud de creación de tablero con propietario
/// </summary>
public class CreateBoardRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Color { get; set; } = "#2563eb";
    public string OwnerId { get; set; } = string.Empty;
}

/// <summary>
/// DTO para respuesta de tablero
/// </summary>
public class BoardResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public List<string> Members { get; set; } = new List<string>();
    public string Color { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}
