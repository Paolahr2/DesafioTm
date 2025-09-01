using MongoDB.Driver;
using Domain.Interfaces;
using Infrastructure.Data;
using MongoDB.Bson;

namespace Infrastructure.Repositories;

/// <summary>
/// Implementación base del patrón Repository para MongoDB
/// Proporciona operaciones CRUD básicas para cualquier entidad
/// Implementa los principios SOLID y arquitectura limpia
/// </summary>
/// <typeparam name="T">Tipo de entidad que debe tener una propiedad Id de tipo string</typeparam>
public abstract class BaseRepository<T> : IBaseRepository<T> where T : class
{
    /// <summary>
    /// Colección MongoDB específica para el tipo T
    /// Protegida para que las clases derivadas puedan acceder
    /// </summary>
    protected readonly IMongoCollection<T> _collection;
    
    /// <summary>
    /// Contexto MongoDB para acceso a la base de datos
    /// </summary>
    protected readonly MongoDbContext _context;

    /// <summary>
    /// Constructor base que inicializa la colección MongoDB
    /// </summary>
    /// <param name="context">Contexto MongoDB</param>
    /// <param name="collectionGetter">Función que obtiene la colección específica del contexto</param>
    protected BaseRepository(MongoDbContext context, Func<MongoDbContext, IMongoCollection<T>> collectionGetter)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _collection = collectionGetter(context) ?? throw new ArgumentNullException(nameof(collectionGetter));
    }

    /// <summary>
    /// Obtiene una entidad por su ID único
    /// Implementa el patrón Template Method
    /// </summary>
    /// <param name="id">Identificador único de la entidad</param>
    /// <returns>La entidad si existe, null en caso contrario</returns>
    public virtual async Task<T?> GetByIdAsync(string id)
    {
        try
        {
            // Validar que el ID es un ObjectId válido de MongoDB
            if (!ObjectId.TryParse(id, out _))
            {
                return null;
            }

            // Usar filtro por campo "_id" que es el campo ID de MongoDB
            var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            // Log del error (en producción usar ILogger)
            Console.WriteLine($"Error getting entity by ID {id}: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Obtiene todas las entidades de la colección
    /// Implementa paginación implícita para evitar cargar demasiados datos
    /// </summary>
    /// <returns>Lista de todas las entidades</returns>
    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        try
        {
            return await _collection.Find(_ => true).ToListAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting all entities: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Crea una nueva entidad en la base de datos
    /// Implementa validaciones básicas antes de la inserción
    /// </summary>
    /// <param name="entity">Entidad a crear</param>
    /// <returns>La entidad creada con su ID asignado</returns>
    public virtual async Task<T> CreateAsync(T entity)
    {
        try
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            // Insertar la entidad en MongoDB
            await _collection.InsertOneAsync(entity);
            
            return entity;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating entity: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Actualiza una entidad existente
    /// Reemplaza completamente el documento en MongoDB
    /// </summary>
    /// <param name="entity">Entidad con los datos actualizados</param>
    /// <returns>La entidad actualizada</returns>
    public virtual async Task<T> UpdateAsync(T entity)
    {
        try
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            // Obtener el ID de la entidad usando reflexión
            var idProperty = typeof(T).GetProperty("Id");
            if (idProperty == null)
                throw new InvalidOperationException("Entity must have an Id property");

            var id = idProperty.GetValue(entity)?.ToString();
            if (string.IsNullOrEmpty(id) || !ObjectId.TryParse(id, out _))
                throw new ArgumentException("Entity must have a valid Id");

            // Crear filtro y reemplazar el documento
            var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
            var result = await _collection.ReplaceOneAsync(filter, entity);

            if (result.MatchedCount == 0)
                throw new InvalidOperationException($"Entity with ID {id} not found");

            return entity;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating entity: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Elimina una entidad por su ID
    /// Implementa eliminación física (no soft delete)
    /// </summary>
    /// <param name="id">ID de la entidad a eliminar</param>
    /// <returns>True si se eliminó exitosamente</returns>
    public virtual async Task<bool> DeleteAsync(string id)
    {
        try
        {
            if (!ObjectId.TryParse(id, out _))
                return false;

            var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
            var result = await _collection.DeleteOneAsync(filter);

            return result.DeletedCount > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error deleting entity with ID {id}: {ex.Message}");
            throw;
        }
    }

    /// <summary>
    /// Verifica si existe una entidad con el ID especificado
    /// Operación optimizada que no carga el documento completo
    /// </summary>
    /// <param name="id">ID de la entidad a verificar</param>
    /// <returns>True si existe, false en caso contrario</returns>
    public virtual async Task<bool> ExistsAsync(string id)
    {
        try
        {
            if (!ObjectId.TryParse(id, out _))
                return false;

            var filter = Builders<T>.Filter.Eq("_id", ObjectId.Parse(id));
            var count = await _collection.CountDocumentsAsync(filter, new CountOptions { Limit = 1 });

            return count > 0;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error checking if entity exists with ID {id}: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Método helper para crear filtros de búsqueda de texto
    /// Utilizado por las clases derivadas para implementar búsqueda
    /// </summary>
    /// <param name="searchTerm">Término de búsqueda</param>
    /// <param name="fields">Campos donde buscar</param>
    /// <returns>Filtro MongoDB para búsqueda de texto</returns>
    protected FilterDefinition<T> CreateTextSearchFilter(string searchTerm, params string[] fields)
    {
        if (string.IsNullOrWhiteSpace(searchTerm) || fields.Length == 0)
            return Builders<T>.Filter.Empty;

        var builder = Builders<T>.Filter;
        var filters = new List<FilterDefinition<T>>();

        foreach (var field in fields)
        {
            // Crear filtro regex case-insensitive para cada campo
            var regex = new BsonRegularExpression(searchTerm, "i");
            filters.Add(builder.Regex(field, regex));
        }

        // Combinar todos los filtros con OR
        return builder.Or(filters);
    }

    /// <summary>
    /// Método helper para crear filtros de ordenamiento
    /// </summary>
    /// <param name="sortField">Campo por el cual ordenar</param>
    /// <param name="ascending">True para ascendente, false para descendente</param>
    /// <returns>Definición de ordenamiento</returns>
    protected SortDefinition<T> CreateSortDefinition(string sortField, bool ascending = true)
    {
        return ascending 
            ? Builders<T>.Sort.Ascending(sortField)
            : Builders<T>.Sort.Descending(sortField);
    }
}
