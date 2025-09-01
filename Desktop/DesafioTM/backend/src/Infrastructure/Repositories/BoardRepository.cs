using MongoDB.Driver;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using MongoDB.Bson;

namespace Infrastructure.Repositories;

/// <summary>
/// Implementación concreta del repositorio de tableros para MongoDB
/// </summary>
public class BoardRepository : BaseRepository<Board>, IBoardRepository
{
    public BoardRepository(MongoDbContext context) 
        : base(context, ctx => ctx.Boards)
    {
    }

    public async Task<IEnumerable<Board>> GetBoardsByOwnerAsync(string ownerId)
    {
        var filter = Builders<Board>.Filter.Eq(b => b.OwnerId, ownerId);
        var sort = Builders<Board>.Sort.Descending(b => b.UpdatedAt);
        return await _collection.Find(filter).Sort(sort).ToListAsync();
    }

    public async Task<IEnumerable<Board>> GetBoardsByMemberAsync(string userId)
    {
        var filter = Builders<Board>.Filter.AnyEq(b => b.Members, userId);
        var sort = Builders<Board>.Sort.Descending(b => b.UpdatedAt);
        return await _collection.Find(filter).Sort(sort).ToListAsync();
    }

    public async Task<IEnumerable<Board>> GetAccessibleBoardsAsync(string userId)
    {
        var ownerFilter = Builders<Board>.Filter.Eq(b => b.OwnerId, userId);
        var memberFilter = Builders<Board>.Filter.AnyEq(b => b.Members, userId);
        var combinedFilter = Builders<Board>.Filter.Or(ownerFilter, memberFilter);
        
        var sort = Builders<Board>.Sort.Descending(b => b.UpdatedAt);
        return await _collection.Find(combinedFilter).Sort(sort).ToListAsync();
    }

    public async Task<IEnumerable<Board>> SearchBoardsAsync(string searchTerm, string userId)
    {
        var searchFilter = CreateTextSearchFilter(searchTerm, "Name", "Description");
        var accessFilter = Builders<Board>.Filter.Or(
            Builders<Board>.Filter.Eq(b => b.OwnerId, userId),
            Builders<Board>.Filter.AnyEq(b => b.Members, userId)
        );
        
        var combinedFilter = Builders<Board>.Filter.And(searchFilter, accessFilter);
        return await _collection.Find(combinedFilter).ToListAsync();
    }

    public async Task<bool> UserHasAccessAsync(string boardId, string userId)
    {
        if (!ObjectId.TryParse(boardId, out _))
            return false;

        var filter = Builders<Board>.Filter.And(
            Builders<Board>.Filter.Eq("_id", ObjectId.Parse(boardId)),
            Builders<Board>.Filter.Or(
                Builders<Board>.Filter.Eq(b => b.OwnerId, userId),
                Builders<Board>.Filter.AnyEq(b => b.Members, userId)
            )
        );

        var count = await _collection.CountDocumentsAsync(filter, new CountOptions { Limit = 1 });
        return count > 0;
    }

    public async Task<IEnumerable<User>> GetBoardMembersAsync(string boardId)
    {
        var board = await GetByIdAsync(boardId);
        if (board == null) return new List<User>();

        var userFilter = Builders<User>.Filter.In(u => u.Id, board.Members);
        return await _context.Users.Find(userFilter).ToListAsync();
    }

    public async Task<IEnumerable<Board>> GetActiveBoardsAsync(string userId)
    {
        var accessFilter = Builders<Board>.Filter.Or(
            Builders<Board>.Filter.Eq(b => b.OwnerId, userId),
            Builders<Board>.Filter.AnyEq(b => b.Members, userId)
        );
        var activeFilter = Builders<Board>.Filter.Eq(b => b.IsActive, true);
        var combinedFilter = Builders<Board>.Filter.And(accessFilter, activeFilter);
        
        var sort = Builders<Board>.Sort.Descending(b => b.UpdatedAt);
        return await _collection.Find(combinedFilter).Sort(sort).ToListAsync();
    }

    public async Task<bool> BoardNameExistsAsync(string name, string ownerId, string? excludeBoardId = null)
    {
        var filter = Builders<Board>.Filter.And(
            Builders<Board>.Filter.Eq(b => b.Name, name),
            Builders<Board>.Filter.Eq(b => b.OwnerId, ownerId)
        );

        if (!string.IsNullOrEmpty(excludeBoardId) && ObjectId.TryParse(excludeBoardId, out _))
        {
            var excludeFilter = Builders<Board>.Filter.Ne("_id", ObjectId.Parse(excludeBoardId));
            filter = Builders<Board>.Filter.And(filter, excludeFilter);
        }

        var count = await _collection.CountDocumentsAsync(filter, new CountOptions { Limit = 1 });
        return count > 0;
    }

    public async Task<Dictionary<string, object>> GetBoardStatisticsAsync(string boardId)
    {
        var tasks = await _context.Tasks.Find(t => t.BoardId == boardId).ToListAsync();
        
        var stats = new Dictionary<string, object>
        {
            ["TotalTasks"] = tasks.Count,
            ["CompletedTasks"] = tasks.Count(t => t.Status == Domain.Enums.TaskStatus.Completed),
            ["InProgressTasks"] = tasks.Count(t => t.Status == Domain.Enums.TaskStatus.InProgress),
            ["TodoTasks"] = tasks.Count(t => t.Status == Domain.Enums.TaskStatus.Todo),
            ["OverdueTasks"] = tasks.Count(t => t.IsOverdue())
        };

        return stats;
    }
}
