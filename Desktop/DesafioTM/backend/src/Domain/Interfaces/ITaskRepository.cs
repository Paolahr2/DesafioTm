using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

/// <summary>
/// Interfaz específica para el repositorio de tareas
/// Proporciona operaciones especializadas para la gestión de tareas en el sistema Kanban
/// </summary>
public interface ITaskRepository : IBaseRepository<TaskItem>
{
    /// <summary>
    /// Obtiene todas las tareas de un tablero específico
    /// Ordenadas por posición para mantener el orden visual del Kanban
    /// </summary>
    /// <param name="boardId">ID del tablero</param>
    /// <returns>Lista de tareas del tablero ordenadas por posición</returns>
    Task<IEnumerable<TaskItem>> GetTasksByBoardIdAsync(string boardId);

    /// <summary>
    /// Obtiene tareas filtradas por estado específico
    /// Útil para mostrar columnas específicas del Kanban
    /// </summary>
    /// <param name="boardId">ID del tablero</param>
    /// <param name="status">Estado de las tareas a obtener</param>
    /// <returns>Lista de tareas en el estado especificado</returns>
    Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(string boardId, Domain.Enums.TaskStatus status);

    /// <summary>
    /// Obtiene todas las tareas asignadas a un usuario específico
    /// Para vista personal de tareas asignadas
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Lista de tareas asignadas al usuario</returns>
    Task<IEnumerable<TaskItem>> GetTasksByAssignedUserAsync(string userId);

    /// <summary>
    /// Obtiene todas las tareas creadas por un usuario específico
    /// Para tracking de tareas creadas por el usuario
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Lista de tareas creadas por el usuario</returns>
    Task<IEnumerable<TaskItem>> GetTasksByCreatorAsync(string userId);

    /// <summary>
    /// Busca tareas por título o descripción
    /// Implementa funcionalidad de búsqueda de texto
    /// </summary>
    /// <param name="searchTerm">Término de búsqueda</param>
    /// <param name="boardId">ID del tablero (opcional para filtrar)</param>
    /// <returns>Lista de tareas que coinciden con la búsqueda</returns>
    Task<IEnumerable<TaskItem>> SearchTasksAsync(string searchTerm, string? boardId = null);

    /// <summary>
    /// Obtiene tareas que están próximas a vencer
    /// Para notificaciones y alertas de deadlines
    /// </summary>
    /// <param name="days">Número de días para considerar "próximo a vencer"</param>
    /// <returns>Lista de tareas que vencen en los próximos días especificados</returns>
    Task<IEnumerable<TaskItem>> GetTasksDueSoonAsync(int days = 3);

    /// <summary>
    /// Obtiene tareas vencidas que no han sido completadas
    /// Para reportes y seguimiento de tareas atrasadas
    /// </summary>
    /// <returns>Lista de tareas vencidas</returns>
    Task<IEnumerable<TaskItem>> GetOverdueTasksAsync();

    /// <summary>
    /// Obtiene tareas por etiqueta específica
    /// Para filtrado y organización por categorías
    /// </summary>
    /// <param name="tag">Etiqueta a buscar</param>
    /// <param name="boardId">ID del tablero (opcional)</param>
    /// <returns>Lista de tareas con la etiqueta especificada</returns>
    Task<IEnumerable<TaskItem>> GetTasksByTagAsync(string tag, string? boardId = null);

    /// <summary>
    /// Obtiene tareas filtradas por prioridad
    /// Para gestión de workload y priorización
    /// </summary>
    /// <param name="priority">Nivel de prioridad</param>
    /// <param name="boardId">ID del tablero (opcional)</param>
    /// <returns>Lista de tareas con la prioridad especificada</returns>
    Task<IEnumerable<TaskItem>> GetTasksByPriorityAsync(TaskPriority priority, string? boardId = null);

    /// <summary>
    /// Actualiza las posiciones de múltiples tareas
    /// Para reordenamiento drag-and-drop en el tablero Kanban
    /// </summary>
    /// <param name="taskPositions">Diccionario con ID de tarea y nueva posición</param>
    /// <returns>True si todas las actualizaciones fueron exitosas</returns>
    Task<bool> UpdateTaskPositionsAsync(Dictionary<string, int> taskPositions);

    /// <summary>
    /// Obtiene estadísticas básicas de tareas para un tablero
    /// Para dashboards y reportes
    /// </summary>
    /// <param name="boardId">ID del tablero</param>
    /// <returns>Diccionario con conteos por estado</returns>
    Task<Dictionary<Domain.Enums.TaskStatus, int>> GetTaskStatisticsAsync(string boardId);

    /// <summary>
    /// Elimina todas las tareas de un tablero específico
    /// Utilizado cuando se elimina un tablero
    /// </summary>
    /// <param name="boardId">ID del tablero</param>
    /// <returns>Número de tareas eliminadas</returns>
    Task<int> DeleteTasksByBoardIdAsync(string boardId);
}
