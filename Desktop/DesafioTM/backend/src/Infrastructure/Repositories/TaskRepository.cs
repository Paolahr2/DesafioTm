using MongoDB.Driver;
using Domain.Entities;
using Domain.Interfaces;
using Domain.Enums;
using Infrastructure.Data;
using MongoDB.Bson;

namespace Infrastructure.Repositories;

/// <summary>
/// Implementación concreta del repositorio de tareas para MongoDB
/// </summary>
public class TaskRepository : BaseRepository<TaskItem>, ITaskRepository
{
    public TaskRepository(MongoDbContext context) 
        : base(context, ctx => ctx.Tasks)
    {
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByBoardIdAsync(string boardId)
    {
        var filter = Builders<TaskItem>.Filter.Eq(t => t.BoardId, boardId);
        var sort = Builders<TaskItem>.Sort.Ascending(t => t.Position);
        return await _collection.Find(filter).Sort(sort).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(string boardId, Domain.Enums.TaskStatus status)
    {
        var filter = Builders<TaskItem>.Filter.And(
            Builders<TaskItem>.Filter.Eq(t => t.BoardId, boardId),
            Builders<TaskItem>.Filter.Eq(t => t.Status, status)
        );
        var sort = Builders<TaskItem>.Sort.Ascending(t => t.Position);
        return await _collection.Find(filter).Sort(sort).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByAssignedUserAsync(string userId)
    {
        var filter = Builders<TaskItem>.Filter.Eq(t => t.AssignedTo, userId);
        var sort = Builders<TaskItem>.Sort.Descending(t => t.UpdatedAt);
        return await _collection.Find(filter).Sort(sort).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByCreatorAsync(string userId)
    {
        var filter = Builders<TaskItem>.Filter.Eq(t => t.CreatedBy, userId);
        var sort = Builders<TaskItem>.Sort.Descending(t => t.CreatedAt);
        return await _collection.Find(filter).Sort(sort).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> SearchTasksAsync(string searchTerm, string? boardId = null)
    {
        var searchFilter = CreateTextSearchFilter(searchTerm, "Title", "Description");
        
        if (!string.IsNullOrEmpty(boardId))
        {
            var boardFilter = Builders<TaskItem>.Filter.Eq(t => t.BoardId, boardId);
            searchFilter = Builders<TaskItem>.Filter.And(searchFilter, boardFilter);
        }

        return await _collection.Find(searchFilter).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksDueSoonAsync(int days = 3)
    {
        var futureDate = DateTime.UtcNow.AddDays(days);
        var filter = Builders<TaskItem>.Filter.And(
            Builders<TaskItem>.Filter.Lte(t => t.DueDate, futureDate),
            Builders<TaskItem>.Filter.Gte(t => t.DueDate, DateTime.UtcNow),
            Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskStatus.Completed)
        );

        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetOverdueTasksAsync()
    {
        var filter = Builders<TaskItem>.Filter.And(
            Builders<TaskItem>.Filter.Lt(t => t.DueDate, DateTime.UtcNow),
            Builders<TaskItem>.Filter.Ne(t => t.Status, Domain.Enums.TaskStatus.Completed)
        );

        return await _collection.Find(filter).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByTagAsync(string tag, string? boardId = null)
    {
        var tagFilter = Builders<TaskItem>.Filter.AnyEq(t => t.Tags, tag);
        
        if (!string.IsNullOrEmpty(boardId))
        {
            var boardFilter = Builders<TaskItem>.Filter.Eq(t => t.BoardId, boardId);
            tagFilter = Builders<TaskItem>.Filter.And(tagFilter, boardFilter);
        }

        return await _collection.Find(tagFilter).ToListAsync();
    }

    public async Task<IEnumerable<TaskItem>> GetTasksByPriorityAsync(TaskPriority priority, string? boardId = null)
    {
        var priorityFilter = Builders<TaskItem>.Filter.Eq(t => t.Priority, priority);
        
        if (!string.IsNullOrEmpty(boardId))
        {
            var boardFilter = Builders<TaskItem>.Filter.Eq(t => t.BoardId, boardId);
            priorityFilter = Builders<TaskItem>.Filter.And(priorityFilter, boardFilter);
        }

        return await _collection.Find(priorityFilter).ToListAsync();
    }

    public async Task<bool> UpdateTaskPositionsAsync(Dictionary<string, int> taskPositions)
    {
        var bulkOps = new List<WriteModel<TaskItem>>();

        foreach (var kvp in taskPositions)
        {
            if (ObjectId.TryParse(kvp.Key, out _))
            {
                var filter = Builders<TaskItem>.Filter.Eq("_id", ObjectId.Parse(kvp.Key));
                var update = Builders<TaskItem>.Update
                    .Set(t => t.Position, kvp.Value)
                    .Set(t => t.UpdatedAt, DateTime.UtcNow);
                
                bulkOps.Add(new UpdateOneModel<TaskItem>(filter, update));
            }
        }

        if (bulkOps.Count == 0) return false;

        var result = await _collection.BulkWriteAsync(bulkOps);
        return result.ModifiedCount == bulkOps.Count;
    }

    public async Task<Dictionary<Domain.Enums.TaskStatus, int>> GetTaskStatisticsAsync(string boardId)
    {
        var filter = Builders<TaskItem>.Filter.Eq(t => t.BoardId, boardId);
        var tasks = await _collection.Find(filter).ToListAsync();

        return tasks
            .GroupBy(t => t.Status)
            .ToDictionary(g => g.Key, g => g.Count());
    }

    public async Task<int> DeleteTasksByBoardIdAsync(string boardId)
    {
        var filter = Builders<TaskItem>.Filter.Eq(t => t.BoardId, boardId);
        var result = await _collection.DeleteManyAsync(filter);
        return (int)result.DeletedCount;
    }
}
