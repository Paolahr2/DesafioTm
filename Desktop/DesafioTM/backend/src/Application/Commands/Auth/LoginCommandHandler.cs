using Application.DTOs.Auth;
using Application.DTOs.Users;
using Application.Services;
using Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Commands.Auth;

/// <summary>
/// Handler responsable únicamente del proceso de login/autenticación
/// </summary>
public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly Domain.Interfaces.UserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly ILogger<LoginCommandHandler> _logger;

    public LoginCommandHandler(
        Domain.Interfaces.UserRepository userRepository, 
        IJwtService jwtService,
        ILogger<LoginCommandHandler> logger)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Attempting login for user: {EmailOrUsername}", request.EmailOrUsername);

            var user = await GetUserByEmailOrUsernameAsync(request.EmailOrUsername);
            
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                _logger.LogWarning("Invalid credentials for user: {EmailOrUsername}", request.EmailOrUsername);
                return new AuthResponseDto { Success = false, Message = "Credenciales inválidas" };
            }

            if (!user.IsActive)
            {
                _logger.LogWarning("Inactive user attempted login: {EmailOrUsername}", request.EmailOrUsername);
                return new AuthResponseDto { Success = false, Message = "Usuario inactivo" };
            }

            var token = _jwtService.GenerateToken(user.Id, user.Email, user.Username);
            await UpdateUserLastLoginAsync(user);

            _logger.LogInformation("Successful login for user: {EmailOrUsername}", request.EmailOrUsername);

            return new AuthResponseDto
            {
                Success = true,
                Token = token,
                Message = "Login exitoso",
                User = MapToUserDto(user)
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for user: {EmailOrUsername}", request.EmailOrUsername);
            throw;
        }
    }

    private async Task<User?> GetUserByEmailOrUsernameAsync(string emailOrUsername)
    {
        return await _userRepository.GetByEmailAsync(emailOrUsername) 
               ?? await _userRepository.GetByUsernameAsync(emailOrUsername);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }

    private async Task UpdateUserLastLoginAsync(User user)
    {
        user.LastLoginAt = DateTime.UtcNow;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);
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
