using Domain.Entities;
using Domain.Interfaces;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class GenericRepository<T> : Domain.Interfaces.GenericRepository<T> where T : BaseEntity
{
    protected readonly IMongoCollection<T> _collection;
    protected readonly IMongoDatabase _database;

    public GenericRepository(IMongoDatabase database, string collectionName)
    {
        _database = database;
        _collection = database.GetCollection<T>(collectionName);
    }

    public virtual async Task<T> CreateAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _collection.InsertOneAsync(entity);
        return entity;
    }

    public virtual async Task<T?> GetByIdAsync(string id)
    {
        return await _collection.Find(x => x.Id == id).FirstOrDefaultAsync();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        await _collection.ReplaceOneAsync(x => x.Id == entity.Id, entity);
        return entity;
    }

    public virtual async Task<bool> DeleteAsync(string id)
    {
        var result = await _collection.DeleteOneAsync(x => x.Id == id);
        return result.DeletedCount > 0;
    }

    public virtual async Task<IEnumerable<T>> FindAsync(FilterDefinition<T> filter)
    {
        return await _collection.Find(filter).ToListAsync();
    }

    public virtual async Task<long> CountAsync(FilterDefinition<T>? filter = null)
    {
        filter ??= Builders<T>.Filter.Empty;
        return await _collection.CountDocumentsAsync(filter);
    }

    public virtual async Task<bool> ExistsAsync(string id)
    {
        var count = await _collection.CountDocumentsAsync(x => x.Id == id);
        return count > 0;
    }
}
