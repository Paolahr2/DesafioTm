using Domain.Entities;
using Domain.Enums;
using Domain.Interfaces;
using MongoDB.Driver;

namespace Infrastructure.Repositories;

public class TaskRepository : GenericRepository<TaskItem>, Domain.Interfaces.TaskRepository
{
    public TaskRepository(IMongoDatabase database) : base(database, "tasks")
    {
        // Crear índices
        CreateIndexes();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByBoardIdAsync(string boardId)
    {
        return await _collection.Find(x => x.BoardId == boardId)
            .SortBy(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetByBoardIdAsync(string boardId)
    {
        return await GetTasksByBoardIdAsync(boardId);
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByAssignedUserAsync(string userId)
    {
        return await _collection.Find(x => x.AssignedToId == userId)
            .SortBy(x => x.DueDate ?? DateTime.MaxValue)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetByAssignedUserAsync(string userId)
    {
        return await GetTasksByAssignedUserAsync(userId);
    }

    public async Task<IEnumerable<TaskItem>> GetByCreatorAsync(string userId)
    {
        return await _collection.Find(x => x.CreatedById == userId)
            .SortByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(string boardId, Domain.Enums.TaskStatus status)
    {
        return await _collection.Find(x => x.BoardId == boardId && x.Status == status)
            .SortBy(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetOverdueTasksAsync()
    {
        var filter = Builders<TaskItem>.Filter.And(
            Builders<TaskItem>.Filter.Lt(x => x.DueDate, DateTime.UtcNow),
            Builders<TaskItem>.Filter.Ne(x => x.Status, Domain.Enums.TaskStatus.Done)
        );

        return await _collection.Find(filter)
            .SortBy(x => x.DueDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> SearchTasksAsync(string searchTerm, string userId)
    {
        // Buscar tareas en tableros donde el usuario tiene acceso
        var searchFilter = Builders<TaskItem>.Filter.Or(
            Builders<TaskItem>.Filter.Regex(x => x.Title, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            Builders<TaskItem>.Filter.Regex(x => x.Description, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i")),
            Builders<TaskItem>.Filter.AnyEq(x => x.Tags, searchTerm)
        );

        // Para simplicidad, buscar en tareas creadas por el usuario o asignadas a él
        var userFilter = Builders<TaskItem>.Filter.Or(
            Builders<TaskItem>.Filter.Eq(x => x.CreatedById, userId),
            Builders<TaskItem>.Filter.Eq(x => x.AssignedToId, userId)
        );

        var combinedFilter = Builders<TaskItem>.Filter.And(searchFilter, userFilter);

        return await _collection.Find(combinedFilter)
            .SortByDescending(x => x.UpdatedAt)
            .Limit(50)
            .ToListAsync();
    }

    public async Task<int> GetTaskCountByBoardAsync(string boardId)
    {
        var count = await _collection.CountDocumentsAsync(x => x.BoardId == boardId);
        return (int)count;
    }

    private void CreateIndexes()
    {
        try
        {
            // Obtener índices existentes
            var existingIndexes = _collection.Indexes.List().ToList();
            var indexNames = existingIndexes.Select(idx => idx["name"].AsString).ToList();

            // Crear índices solo si no existen
            if (!indexNames.Any(name => name.Contains("board") || name.Contains("Board")))
            {
                var boardIndexKeys = Builders<TaskItem>.IndexKeys.Ascending(x => x.BoardId);
                var boardIndexOptions = new CreateIndexOptions { Name = "idx_task_board" };
                var boardIndexModel = new CreateIndexModel<TaskItem>(boardIndexKeys, boardIndexOptions);
                _collection.Indexes.CreateOne(boardIndexModel);
            }

            if (!indexNames.Any(name => name.Contains("assigned") || name.Contains("Assigned")))
            {
                var assignedIndexKeys = Builders<TaskItem>.IndexKeys.Ascending(x => x.AssignedToId);
                var assignedIndexOptions = new CreateIndexOptions { Name = "idx_task_assigned" };
                var assignedIndexModel = new CreateIndexModel<TaskItem>(assignedIndexKeys, assignedIndexOptions);
                _collection.Indexes.CreateOne(assignedIndexModel);
            }

            if (!indexNames.Any(name => name.Contains("creator") || name.Contains("Creator")))
            {
                var creatorIndexKeys = Builders<TaskItem>.IndexKeys.Ascending(x => x.CreatedById);
                var creatorIndexOptions = new CreateIndexOptions { Name = "idx_task_creator" };
                var creatorIndexModel = new CreateIndexModel<TaskItem>(creatorIndexKeys, creatorIndexOptions);
                _collection.Indexes.CreateOne(creatorIndexModel);
            }

            if (!indexNames.Any(name => name.Contains("duedate") || name.Contains("DueDate")))
            {
                var dueDateIndexKeys = Builders<TaskItem>.IndexKeys.Ascending(x => x.DueDate);
                var dueDateIndexOptions = new CreateIndexOptions { Name = "idx_task_duedate" };
                var dueDateIndexModel = new CreateIndexModel<TaskItem>(dueDateIndexKeys, dueDateIndexOptions);
                _collection.Indexes.CreateOne(dueDateIndexModel);
            }

            if (!indexNames.Any(name => name.Contains("status") || name.Contains("Status")))
            {
                var statusIndexKeys = Builders<TaskItem>.IndexKeys.Ascending(x => x.Status);
                var statusIndexOptions = new CreateIndexOptions { Name = "idx_task_status" };
                var statusIndexModel = new CreateIndexModel<TaskItem>(statusIndexKeys, statusIndexOptions);
                _collection.Indexes.CreateOne(statusIndexModel);
            }

            if (!indexNames.Any(name => name.Contains("text") || name.Contains("Text")))
            {
                var textIndexKeys = Builders<TaskItem>.IndexKeys
                    .Text(x => x.Title)
                    .Text(x => x.Description)
                    .Text(x => x.Tags);
                var textIndexOptions = new CreateIndexOptions { Name = "idx_task_text" };
                var textIndexModel = new CreateIndexModel<TaskItem>(textIndexKeys, textIndexOptions);
                _collection.Indexes.CreateOne(textIndexModel);
            }
        }
        catch (Exception)
        {
            // Si hay algún error creando índices, continuar sin fallar
            // Los índices se pueden crear manualmente en MongoDB si es necesario
        }
    }
}
