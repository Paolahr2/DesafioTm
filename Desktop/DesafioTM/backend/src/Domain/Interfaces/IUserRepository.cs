using Domain.Entities;
using Domain.Enums;

namespace Domain.Interfaces;

/// <summary>
/// Interfaz específica para el repositorio de usuarios
/// Extiende IBaseRepository con operaciones específicas para usuarios
/// Siguiendo el Principio de Segregación de Interfaces (ISP)
/// </summary>
public interface IUserRepository : IBaseRepository<User>
{
    /// <summary>
    /// Busca un usuario por su nombre de usuario único
    /// Utilizado para autenticación y validación de unicidad
    /// </summary>
    /// <param name="username">Nombre de usuario a buscar</param>
    /// <returns>El usuario si existe, null en caso contrario</returns>
    Task<User?> GetByUsernameAsync(string username);

    /// <summary>
    /// Busca un usuario por su email
    /// Utilizado para autenticación y validación de unicidad
    /// </summary>
    /// <param name="email">Email a buscar</param>
    /// <returns>El usuario si existe, null en caso contrario</returns>
    Task<User?> GetByEmailAsync(string email);

    /// <summary>
    /// Verifica si un nombre de usuario ya existe en el sistema
    /// </summary>
    /// <param name="username">Nombre de usuario a verificar</param>
    /// <returns>True si existe, false en caso contrario</returns>
    Task<bool> UsernameExistsAsync(string username);

    /// <summary>
    /// Verifica si un email ya existe en el sistema
    /// </summary>
    /// <param name="email">Email a verificar</param>
    /// <returns>True si existe, false en caso contrario</returns>
    Task<bool> EmailExistsAsync(string email);

    /// <summary>
    /// Actualiza la fecha y hora del último login de un usuario
    /// </summary>
    /// <param name="userId">ID del usuario</param>
    /// <returns>Task completado</returns>
    Task UpdateLastLoginAsync(string userId);

    /// <summary>
    /// Obtiene todos los usuarios activos del sistema
    /// Excluye usuarios desactivados/eliminados
    /// </summary>
    /// <returns>Lista de usuarios activos</returns>
    Task<IEnumerable<User>> GetActiveUsersAsync();

    /// <summary>
    /// Busca usuarios por coincidencia parcial en nombre o username
    /// Útil para funciones de autocompletado y búsqueda
    /// </summary>
    /// <param name="searchTerm">Término de búsqueda</param>
    /// <returns>Lista de usuarios que coinciden con el término</returns>
    Task<IEnumerable<User>> SearchUsersAsync(string searchTerm);

    /// <summary>
    /// Obtiene usuarios filtrados por estado de actividad
    /// Para administración y reportes
    /// </summary>
    /// <param name="isActive">Estado de actividad a filtrar</param>
    /// <returns>Lista de usuarios con el estado especificado</returns>
    Task<IEnumerable<User>> GetUsersByStatusAsync(bool isActive);

    /// <summary>
    /// Cuenta el total de usuarios registrados
    /// Para estadísticas del sistema
    /// </summary>
    /// <returns>Número total de usuarios</returns>
    Task<int> GetTotalUsersCountAsync();

    /// <summary>
    /// Desactiva un usuario (soft delete)
    /// Marca el usuario como inactivo sin eliminarlo físicamente
    /// </summary>
    /// <param name="userId">ID del usuario a desactivar</param>
    /// <returns>True si se desactivó correctamente</returns>
    Task<bool> DeactivateUserAsync(string userId);

    /// <summary>
    /// Reactiva un usuario previamente desactivado
    /// </summary>
    /// <param name="userId">ID del usuario a reactivar</param>
    /// <returns>True si se reactivó correctamente</returns>
    Task<bool> ReactivateUserAsync(string userId);
}
