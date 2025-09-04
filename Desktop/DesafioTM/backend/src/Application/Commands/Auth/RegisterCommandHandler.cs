using Application.DTOs.Auth;
using Application.DTOs.Users;
using Application.Services;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Commands.Auth;

/// <summary>
/// Handler responsable únicamente del proceso de registro de usuarios
/// </summary>
public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly Domain.Interfaces.UserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly ILogger<RegisterCommandHandler> _logger;

    public RegisterCommandHandler(
        Domain.Interfaces.UserRepository userRepository,
        IJwtService jwtService,
        ILogger<RegisterCommandHandler> logger)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Attempting to register user: {Email}", request.Request.Email);

            await ValidateUserDoesNotExistAsync(request.Request);

            var user = CreateUserFromRequest(request.Request);
            await _userRepository.CreateAsync(user);

            var token = _jwtService.GenerateToken(user.Id, user.Email, user.Username);

            _logger.LogInformation("Successfully registered user: {Email}", request.Request.Email);

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                Message = "Usuario registrado exitosamente",
                User = MapToUserDto(user)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for user: {Email}", request.Request.Email);
            throw;
        }
    }

    private async Task ValidateUserDoesNotExistAsync(RegisterRequestDto request)
    {
        var existingUserByEmail = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUserByEmail != null)
        {
            throw new InvalidOperationException("Ya existe un usuario con este email");
        }

        var existingUserByUsername = await _userRepository.GetByUsernameAsync(request.Username);
        if (existingUserByUsername != null)
        {
            throw new InvalidOperationException("Ya existe un usuario con este nombre de usuario");
        }
    }

    private static User CreateUserFromRequest(RegisterRequestDto request)
    {
        return new User
        {
            Username = request.Username,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = UserRole.User,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
