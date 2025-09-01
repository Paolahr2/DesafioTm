namespace Domain.Enums;

/// <summary>
/// Enumeración que representa los posibles estados de una tarea en el flujo Kanban
/// Implementa el patrón Estado para manejar las transiciones de las tareas
/// </summary>
public enum TaskStatus
{
    /// <summary>
    /// Tarea creada pero no iniciada - Columna "Por Hacer"
    /// Estado inicial de todas las tareas nuevas
    /// </summary>
    Todo = 0,

    /// <summary>
    /// Tarea en progreso - Columna "En Progreso"
    /// Indica que alguien está trabajando actualmente en la tarea
    /// </summary>
    InProgress = 1,

    /// <summary>
    /// Tarea en revisión - Columna "En Revisión"  
    /// La tarea está completada pero pendiente de aprobación
    /// </summary>
    InReview = 2,

    /// <summary>
    /// Tarea completada - Columna "Completado"
    /// Estado final cuando la tarea ha sido terminada y aprobada
    /// </summary>
    Completed = 3,

    /// <summary>
    /// Tarea bloqueada - Estado especial
    /// Indica que hay impedimentos que previenen el progreso
    /// </summary>
    Blocked = 4
}

/// <summary>
/// Enumeración que representa la prioridad de una tarea
/// Utilizada para ordenamiento y gestión de la carga de trabajo
/// </summary>
public enum TaskPriority
{
    /// <summary>
    /// Prioridad baja - Tareas que pueden esperar
    /// No son urgentes ni críticas para el proyecto
    /// </summary>
    Low = 0,

    /// <summary>
    /// Prioridad media - Prioridad por defecto
    /// Tareas importantes pero no críticas
    /// </summary>
    Medium = 1,

    /// <summary>
    /// Prioridad alta - Tareas importantes
    /// Deben ser atendidas con prioridad pero no son emergencias
    /// </summary>
    High = 2,

    /// <summary>
    /// Prioridad crítica - Máxima urgencia
    /// Tareas que bloquean otras actividades o son emergencias
    /// </summary>
    Critical = 3
}

/// <summary>
/// Enumeración que representa los roles de usuario en el sistema
/// Implementa control de acceso basado en roles (RBAC)
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Usuario estándar - Permisos básicos
    /// Puede crear y gestionar sus propias tareas
    /// </summary>
    User = 0,

    /// <summary>
    /// Líder de proyecto - Permisos extendidos
    /// Puede gestionar tareas de su equipo y asignar trabajo
    /// </summary>
    ProjectLead = 1,

    /// <summary>
    /// Administrador - Permisos completos
    /// Acceso total al sistema, puede gestionar usuarios y configuración
    /// </summary>
    Admin = 2
}
