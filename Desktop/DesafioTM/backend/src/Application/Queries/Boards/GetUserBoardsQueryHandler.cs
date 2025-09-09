using Application.DTOs;
using Domain.Interfaces;
using MediatR;

namespace Application.Queries.Boards;

/// <summary>
/// Handler para GetUserBoardsQuery
/// </summary>
public class GetUserBoardsQueryHandler : IRequestHandler<GetUserBoardsQuery, List<BoardDto>>
{
    private readonly BoardRepository _boardRepository;

    public GetUserBoardsQueryHandler(BoardRepository boardRepository)
    {
        _boardRepository = boardRepository;
    }

    public async Task<List<BoardDto>> Handle(GetUserBoardsQuery request, CancellationToken cancellationToken)
    {
        var boards = await _boardRepository.GetUserBoardsAsync(request.UserId);

        return boards.Select(board => new BoardDto
        {
            Id = board.Id,
            Title = board.Title,
            Description = board.Description,
            OwnerId = board.OwnerId,
            MemberIds = board.MemberIds,
            Color = board.Color,
            IsArchived = board.IsArchived,
            IsPublic = board.IsPublic,
            CreatedAt = board.CreatedAt,
            UpdatedAt = board.UpdatedAt
        }).ToList();
    }
}
