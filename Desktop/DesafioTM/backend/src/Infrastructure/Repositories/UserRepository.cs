using Domain.Entities;
using Domain.Interfaces;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class UserRepository : GenericRepository<User>, Domain.Interfaces.UserRepository
{
    public UserRepository(IMongoDatabase database) : base(database, "users")
    {
        // Crear índices
        CreateIndexes();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _collection.Find(x => x.Email.ToLower() == email.ToLower()).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _collection.Find(x => x.Username.ToLower() == username.ToLower()).FirstOrDefaultAsync();
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        var count = await _collection.CountDocumentsAsync(x => x.Email.ToLower() == email.ToLower());
        return count > 0;
    }

    public async Task<bool> UsernameExistsAsync(string username)
    {
        var count = await _collection.CountDocumentsAsync(x => x.Username.ToLower() == username.ToLower());
        return count > 0;
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _collection.Find(x => x.IsActive).ToListAsync();
    }

    public async Task<IEnumerable<User>> SearchUsersAsync(string searchTerm, int limit = 10)
    {
        var filter = Builders<User>.Filter.Or(
            Builders<User>.Filter.Regex(x => x.Username, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            Builders<User>.Filter.Regex(x => x.Email, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            Builders<User>.Filter.Regex(x => x.FirstName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            Builders<User>.Filter.Regex(x => x.LastName, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
        );

        return await _collection.Find(filter).Limit(limit).ToListAsync();
    }

    private void CreateIndexes()
    {
        try
        {
            // Obtener índices existentes
            var existingIndexes = _collection.Indexes.List().ToList();
            var indexNames = existingIndexes.Select(idx => idx["name"].AsString).ToList();

            // Crear índice para email solo si no existe
            if (!indexNames.Any(name => name.Contains("email") || name.Contains("Email")))
            {
                var emailIndexKeys = Builders<User>.IndexKeys.Ascending(x => x.Email);
                var emailIndexOptions = new CreateIndexOptions { 
                    Unique = true,
                    Name = "idx_user_email_unique"
                };
                var emailIndexModel = new CreateIndexModel<User>(emailIndexKeys, emailIndexOptions);
                _collection.Indexes.CreateOne(emailIndexModel);
            }

            // Crear índice para username solo si no existe
            if (!indexNames.Any(name => name.Contains("username") || name.Contains("Username")))
            {
                var usernameIndexKeys = Builders<User>.IndexKeys.Ascending(x => x.Username);
                var usernameIndexOptions = new CreateIndexOptions { 
                    Unique = true,
                    Name = "idx_user_username_unique"
                };
                var usernameIndexModel = new CreateIndexModel<User>(usernameIndexKeys, usernameIndexOptions);
                _collection.Indexes.CreateOne(usernameIndexModel);
            }
        }
        catch (Exception)
        {
            // Si hay algún error creando índices, continuar sin fallar
            // Los índices se pueden crear manualmente en MongoDB si es necesario
        }
    }
}
