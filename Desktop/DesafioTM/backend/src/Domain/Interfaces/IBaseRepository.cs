using Domain.Entities;

namespace Domain.Interfaces;

/// <summary>
/// Interfaz base para operaciones genéricas de repositorio
/// Implementa el patrón Repository siguiendo principios SOLID
/// T representa cualquier entidad del dominio
/// </summary>
/// <typeparam name="T">Tipo de entidad</typeparam>
public interface IBaseRepository<T> where T : class
{
    /// <summary>
    /// Obtiene una entidad por su identificador único
    /// </summary>
    /// <param name="id">Identificador único de la entidad</param>
    /// <returns>La entidad si existe, null en caso contrario</returns>
    Task<T?> GetByIdAsync(string id);

    /// <summary>
    /// Obtiene todas las entidades del repositorio
    /// </summary>
    /// <returns>Lista de todas las entidades</returns>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Crea una nueva entidad en el repositorio
    /// </summary>
    /// <param name="entity">Entidad a crear</param>
    /// <returns>La entidad creada con su ID asignado</returns>
    Task<T> CreateAsync(T entity);

    /// <summary>
    /// Actualiza una entidad existente
    /// </summary>
    /// <param name="entity">Entidad con los datos actualizados</param>
    /// <returns>La entidad actualizada</returns>
    Task<T> UpdateAsync(T entity);

    /// <summary>
    /// Elimina una entidad del repositorio
    /// </summary>
    /// <param name="id">ID de la entidad a eliminar</param>
    /// <returns>True si se eliminó exitosamente</returns>
    Task<bool> DeleteAsync(string id);

    /// <summary>
    /// Verifica si existe una entidad con el ID especificado
    /// </summary>
    /// <param name="id">ID de la entidad a verificar</param>
    /// <returns>True si existe, false en caso contrario</returns>
    Task<bool> ExistsAsync(string id);
}
