using MongoDB.Driver;
using Infrastructure.Configuration;
using Microsoft.Extensions.Options;
using Domain.Entities;

namespace Infrastructure.Data;

/// <summary>
/// Contexto de base de datos MongoDB para el sistema de gestión de tareas
/// Implementa el patrón Repository/Unit of Work para acceso a datos
/// Proporciona acceso centralizado a todas las colecciones de MongoDB
/// </summary>
public class MongoDbContext
{
    /// <summary>
    /// Cliente de MongoDB para conexión a la base de datos
    /// </summary>
    private readonly IMongoClient _mongoClient;
    
    /// <summary>
    /// Base de datos específica del proyecto
    /// </summary>
    private readonly IMongoDatabase _database;
    
    /// <summary>
    /// Configuración de la base de datos inyectada
    /// </summary>
    private readonly DatabaseSettings _settings;

    /// <summary>
    /// Constructor que inicializa el contexto de MongoDB
    /// Inyecta dependencias siguiendo principios SOLID
    /// </summary>
    /// <param name="mongoClient">Cliente de MongoDB configurado</param>
    /// <param name="settings">Configuración de la base de datos</param>
    public MongoDbContext(IMongoClient mongoClient, IOptions<DatabaseSettings> settings)
    {
        _mongoClient = mongoClient ?? throw new ArgumentNullException(nameof(mongoClient));
        _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
        
        // Obtener referencia a la base de datos específica
        _database = _mongoClient.GetDatabase(_settings.DatabaseName);
    }

    /// <summary>
    /// Colección de usuarios en MongoDB
    /// Proporciona acceso a todas las operaciones CRUD de usuarios
    /// </summary>
    public IMongoCollection<User> Users => 
        _database.GetCollection<User>(_settings.UsersCollection);

    /// <summary>
    /// Colección de tareas en MongoDB
    /// Proporciona acceso a todas las operaciones CRUD de tareas
    /// </summary>
    public IMongoCollection<TaskItem> Tasks => 
        _database.GetCollection<TaskItem>(_settings.TasksCollection);

    /// <summary>
    /// Colección de tableros en MongoDB
    /// Proporciona acceso a todas las operaciones CRUD de tableros
    /// </summary>
    public IMongoCollection<Board> Boards => 
        _database.GetCollection<Board>(_settings.BoardsCollection);

    /// <summary>
    /// Referencia a la base de datos MongoDB
    /// Útil para operaciones transaccionales y de mantenimiento
    /// </summary>
    public IMongoDatabase Database => _database;

    /// <summary>
    /// Cliente MongoDB para operaciones avanzadas
    /// Proporciona acceso al cliente para configuraciones específicas
    /// </summary>
    public IMongoClient Client => _mongoClient;

    /// <summary>
    /// Verifica la conectividad con la base de datos
    /// Útil para health checks y diagnósticos
    /// </summary>
    /// <returns>True si la conexión es exitosa</returns>
    public async Task<bool> TestConnectionAsync()
    {
        try
        {
            // Intenta ejecutar un comando simple para verificar la conexión
            await _database.RunCommandAsync<object>("{ ping: 1 }");
            return true;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Crea índices necesarios para optimizar las consultas
    /// Se ejecuta durante la inicialización de la aplicación
    /// </summary>
    public async Task CreateIndexesAsync()
    {
        try
        {
            // Índices para la colección Users
            var userIndexes = new[]
            {
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Username)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Email)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.IsActive))
            };
            await Users.Indexes.CreateManyAsync(userIndexes);

            // Índices para la colección Tasks
            var taskIndexes = new[]
            {
                new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.BoardId)),
                new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.AssignedTo)),
                new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.CreatedBy)),
                new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.Status)),
                new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.DueDate)),
                new CreateIndexModel<TaskItem>(Builders<TaskItem>.IndexKeys.Ascending(t => t.Priority))
            };
            await Tasks.Indexes.CreateManyAsync(taskIndexes);

            // Índices para la colección Boards
            var boardIndexes = new[]
            {
                new CreateIndexModel<Board>(Builders<Board>.IndexKeys.Ascending(b => b.OwnerId)),
                new CreateIndexModel<Board>(Builders<Board>.IndexKeys.Ascending(b => b.Members)),
                new CreateIndexModel<Board>(Builders<Board>.IndexKeys.Ascending(b => b.IsActive))
            };
            await Boards.Indexes.CreateManyAsync(boardIndexes);
        }
        catch (Exception ex)
        {
            // Log error but don't fail the application startup
            Console.WriteLine($"Error creating indexes: {ex.Message}");
        }
    }
}
