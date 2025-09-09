using Application.Commands.Boards;
using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using MediatR;

namespace Application.Handlers.Boards;

/// <summary>
/// Handler para CreateBoardCommand
/// </summary>
public class CreateBoardCommandHandler : IRequestHandler<CreateBoardCommand, BoardDto>
{
    private readonly BoardRepository _boardRepository;

    public CreateBoardCommandHandler(BoardRepository boardRepository)
    {
        _boardRepository = boardRepository;
    }

    public async Task<BoardDto> Handle(CreateBoardCommand request, CancellationToken cancellationToken)
    {
        var board = new Board
        {
            Title = request.BoardDto.Title,
            Description = request.BoardDto.Description,
            OwnerId = request.UserId,
            MemberIds = new List<string> { request.UserId },
            Color = request.BoardDto.Color,
            IsArchived = false,
            IsPublic = request.BoardDto.IsPublic,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _boardRepository.CreateAsync(board);

        return new BoardDto
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
        };
    }
}
