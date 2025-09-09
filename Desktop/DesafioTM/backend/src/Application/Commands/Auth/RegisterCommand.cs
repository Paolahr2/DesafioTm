// ============================================================================
// REGISTER COMMAND - CLEAN ARCHITECTURE
// ============================================================================

using MediatR;
using Application.DTOs;

namespace Application.Commands.Auth
{
    public record RegisterCommand(
        string Username,
        string Email, 
        string Password,
        string FullName
    ) : IRequest<RegisterResultDto>;
}
