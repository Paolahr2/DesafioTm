namespace Domain.Enums;

// Estados posibles de una tarea en el flujo Kanban
public enum TaskStatus
{
    Todo = 0,
    InProgress = 1,
    InReview = 2,
    Done = 3,
    Blocked = 4
}

// Niveles de prioridad para las tareas
public enum TaskPriority
{
    Low = 0,
    Medium = 1,
    High = 2,
    Critical = 3
}

// Roles de usuario en el sistema
public enum UserRole
{
    User = 0,
    Admin = 1,
    ProjectManager = 2
}

// Tipos de notificaciones disponibles
public enum NotificationType
{
    TaskAssigned = 0,
    TaskCompleted = 1,
    TaskDueDate = 2,
    BoardInvitation = 3,
    SystemMessage = 4
}
