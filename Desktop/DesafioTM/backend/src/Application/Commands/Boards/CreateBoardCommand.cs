using Application.DTOs;
using MediatR;

namespace Application.Commands.Boards;

/// <summary>
/// Comando para crear un nuevo tablero
/// </summary>
public record CreateBoardCommand(CreateBoardDto Board, string OwnerId) : IRequest<BoardDto>;
