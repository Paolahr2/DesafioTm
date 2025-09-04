using Application.DTOs;
using MediatR;

namespace Application.Queries.Boards;

/// <summary>
/// Query para obtener todos los tableros de un usuario específico
/// </summary>
public record GetUserBoardsQuery(string UserId) : IRequest<IEnumerable<BoardDto>>;
