using Application.DTOs;
using MediatR;

namespace Application.Queries.Boards;

/// <summary>
/// Query para obtener tableros públicos con paginación
/// </summary>
public record GetPublicBoardsQuery(int Page = 1, int PageSize = 10) : IRequest<IEnumerable<BoardDto>>;
