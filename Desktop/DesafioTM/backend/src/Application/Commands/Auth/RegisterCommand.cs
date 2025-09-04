using Application.DTOs.Auth;
using MediatR;

namespace Application.Commands.Auth;

/// <summary>
/// Comando para registrar un nuevo usuario en el sistema
/// </summary>
public record RegisterCommand(RegisterRequestDto Request) : IRequest<AuthResponseDto>;
