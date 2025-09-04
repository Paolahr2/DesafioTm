using Application.DTOs;
using MediatR;

namespace Application.Commands.Boards;

/// <summary>
/// Comando para actualizar un tablero existente
/// </summary>
public record UpdateBoardCommand(string BoardId, UpdateBoardDto Board, string UserId) : IRequest<BoardDto?>;
