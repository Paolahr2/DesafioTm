using Application.DTOs;
using MediatR;

namespace Application.Queries.Boards;

/// <summary>
/// Query para obtener un tablero específico por su ID
/// </summary>
public record GetBoardByIdQuery(string BoardId, string UserId) : IRequest<BoardDto?>;
