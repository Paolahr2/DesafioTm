using Application.DTOs.Auth;
using MediatR;

namespace Application.Commands.Auth;

/// <summary>
/// Comando para autenticar un usuario en el sistema
/// </summary>
public record LoginCommand(string EmailOrUsername, string Password) : IRequest<AuthResponseDto>;
