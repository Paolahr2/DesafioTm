using MediatR;

namespace Application.Commands.Boards;

/// <summary>
/// Comando para eliminar un tablero
/// </summary>
public record DeleteBoardCommand(string BoardId, string UserId) : IRequest<bool>;
