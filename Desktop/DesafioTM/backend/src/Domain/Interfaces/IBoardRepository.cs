using Domain.Entities;

namespace Domain.Interfaces;

/// <summary>
/// Interfaz específica para el repositorio de tableros
/// Proporciona operaciones especializadas para la gestión de tableros Kanban
/// </summary>
public interface IBoardRepository : IBaseRepository<Board>
{
    /// <summary>
    /// Obtiene todos los tableros donde un usuario es propietario
    /// Para mostrar tableros creados por el usuario
    /// </summary>
    /// <param name="ownerId">ID del usuario propietario</param>
    /// <returns>Lista de tableros propiedad del usuario</returns>
    Task<IEnumerable<Board>> GetBoardsByOwnerAsync(string ownerId);

    /// <summary>
    /// Obtiene todos los tableros donde un usuario es miembro
    /// Incluye tableros compartidos con el usuario
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Lista de tableros donde el usuario es miembro</returns>
    Task<IEnumerable<Board>> GetBoardsByMemberAsync(string userId);

    /// <summary>
    /// Obtiene todos los tableros accesibles para un usuario
    /// Combina tableros propios y tableros donde es miembro
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Lista de todos los tableros accesibles al usuario</returns>
    Task<IEnumerable<Board>> GetAccessibleBoardsAsync(string userId);

    /// <summary>
    /// Busca tableros por nombre
    /// Útil para funciones de búsqueda y filtrado
    /// </summary>
    /// <param name="searchTerm">Término de búsqueda</param>
    /// <param name="userId">ID del usuario (para filtrar solo tableros accesibles)</param>
    /// <returns>Lista de tableros que coinciden con la búsqueda</returns>
    Task<IEnumerable<Board>> SearchBoardsAsync(string searchTerm, string userId);

    /// <summary>
    /// Verifica si un usuario tiene acceso a un tablero específico
    /// Para validaciones de autorización
    /// </summary>
    /// <param name="boardId">ID del tablero</param>
    /// <param name="userId">ID del usuario</param>
    /// <returns>True si el usuario tiene acceso</returns>
    Task<bool> UserHasAccessAsync(string boardId, string userId);

    /// <summary>
    /// Obtiene todos los miembros de un tablero con información de usuario
    /// Para gestión de miembros y permisos
    /// </summary>
    /// <param name="boardId">ID del tablero</param>
    /// <returns>Lista de usuarios que son miembros del tablero</returns>
    Task<IEnumerable<User>> GetBoardMembersAsync(string boardId);

    /// <summary>
    /// Obtiene tableros activos solamente
    /// Excluye tableros eliminados/archivados
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Lista de tableros activos accesibles al usuario</returns>
    Task<IEnumerable<Board>> GetActiveBoardsAsync(string userId);

    /// <summary>
    /// Verifica si un nombre de tablero ya existe para un usuario
    /// Previene duplicados de nombres para el mismo propietario
    /// </summary>
    /// <param name="name">Nombre del tablero</param>
    /// <param name="ownerId">ID del propietario</param>
    /// <param name="excludeBoardId">ID del tablero a excluir (para edición)</param>
    /// <returns>True si el nombre ya existe</returns>
    Task<bool> BoardNameExistsAsync(string name, string ownerId, string? excludeBoardId = null);

    /// <summary>
    /// Obtiene estadísticas básicas de un tablero
    /// Para dashboards y reportes
    /// </summary>
    /// <param name="boardId">ID del tablero</param>
    /// <returns>Diccionario con estadísticas del tablero</returns>
    Task<Dictionary<string, object>> GetBoardStatisticsAsync(string boardId);
}
