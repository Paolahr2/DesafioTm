using MongoDB.Driver;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using MongoDB.Bson;

namespace Infrastructure.Repositories;

/// <summary>
/// Implementación concreta del repositorio de usuarios para MongoDB
/// Extiende BaseRepository con operaciones específicas de usuarios
/// </summary>
public class UserRepository : BaseRepository<User>, IUserRepository
{
    /// <summary>
    /// Constructor que inicializa el repositorio de usuarios
    /// </summary>
    /// <param name="context">Contexto de MongoDB</param>
    public UserRepository(MongoDbContext context) 
        : base(context, ctx => ctx.Users)
    {
    }

    /// <summary>
    /// Busca un usuario por su nombre de usuario único
    /// </summary>
    public async Task<User?> GetByUsernameAsync(string username)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Username, username);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    /// <summary>
    /// Busca un usuario por su email
    /// </summary>
    public async Task<User?> GetByEmailAsync(string email)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Email, email);
        return await _collection.Find(filter).FirstOrDefaultAsync();
    }

    /// <summary>
    /// Verifica si un username ya existe
    /// </summary>
    public async Task<bool> UsernameExistsAsync(string username)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Username, username);
        var count = await _collection.CountDocumentsAsync(filter, new CountOptions { Limit = 1 });
        return count > 0;
    }

    /// <summary>
    /// Verifica si un email ya está registrado
    /// </summary>
    public async Task<bool> EmailExistsAsync(string email)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Email, email);
        var count = await _collection.CountDocumentsAsync(filter, new CountOptions { Limit = 1 });
        return count > 0;
    }

    /// <summary>
    /// Obtiene todos los usuarios activos
    /// </summary>
    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        var filter = Builders<User>.Filter.Eq(u => u.IsActive, true);
        return await _collection.Find(filter).ToListAsync();
    }

    /// <summary>
    /// Busca usuarios por término de búsqueda
    /// </summary>
    public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm)
    {
        var filter = CreateTextSearchFilter(searchTerm, "Username", "FullName", "Email");
        var activeFilter = Builders<User>.Filter.Eq(u => u.IsActive, true);
        var combinedFilter = Builders<User>.Filter.And(filter, activeFilter);
        
        return await _collection.Find(combinedFilter).ToListAsync();
    }

    /// <summary>
    /// Actualiza la fecha de último login
    /// </summary>
    public async Task UpdateLastLoginAsync(string userId)
    {
        if (!ObjectId.TryParse(userId, out _))
            return;

        var filter = Builders<User>.Filter.Eq("_id", ObjectId.Parse(userId));
        var update = Builders<User>.Update
            .Set(u => u.LastLoginAt, DateTime.UtcNow)
            .Set(u => u.UpdatedAt, DateTime.UtcNow);
        
        await _collection.UpdateOneAsync(filter, update);
    }

    /// <summary>
    /// Obtiene usuarios filtrados por estado de actividad
    /// </summary>
    public async Task<IEnumerable<User>> GetUsersByStatusAsync(bool isActive)
    {
        var filter = Builders<User>.Filter.Eq(u => u.IsActive, isActive);
        return await _collection.Find(filter).ToListAsync();
    }

    /// <summary>
    /// Cuenta el total de usuarios registrados
    /// </summary>
    public async Task<int> GetTotalUsersCountAsync()
    {
        return (int)await _collection.CountDocumentsAsync(Builders<User>.Filter.Empty);
    }

    /// <summary>
    /// Desactiva un usuario (soft delete)
    /// </summary>
    public async Task<bool> DeactivateUserAsync(string userId)
    {
        if (!ObjectId.TryParse(userId, out _))
            return false;

        var filter = Builders<User>.Filter.Eq("_id", ObjectId.Parse(userId));
        var update = Builders<User>.Update
            .Set(u => u.IsActive, false)
            .Set(u => u.UpdatedAt, DateTime.UtcNow);
        
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    /// <summary>
    /// Reactiva un usuario previamente desactivado
    /// </summary>
    public async Task<bool> ReactivateUserAsync(string userId)
    {
        if (!ObjectId.TryParse(userId, out _))
            return false;

        var filter = Builders<User>.Filter.Eq("_id", ObjectId.Parse(userId));
        var update = Builders<User>.Update
            .Set(u => u.IsActive, true)
            .Set(u => u.UpdatedAt, DateTime.UtcNow);
        
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }
}
