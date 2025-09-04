using Application.DTOs.Auth;
using Application.DTOs.Users;
using Application.Factories;
using Application.Services.Token;
using Domain.Entities;
using Domain.Interfaces.Users;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Commands.Auth;

/// <summary>
/// DIP: Handler que depende de abstracciones (interfaces y factories) NO de implementaciones
/// LSP: Puede trabajar con cualquier implementación que respete los contratos
/// </summary>
public class DIPCompliantLoginHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IRepositoryFactory _repositoryFactory;
    private readonly IApplicationServiceFactory _serviceFactory;
    private readonly ILogger<DIPCompliantLoginHandler> _logger;

    // DIP: Constructor depende de abstracciones, no de implementaciones concretas
    public DIPCompliantLoginHandler(
        IRepositoryFactory repositoryFactory,
        IApplicationServiceFactory serviceFactory,
        ILogger<DIPCompliantLoginHandler> logger)
    {
        _repositoryFactory = repositoryFactory;
        _serviceFactory = serviceFactory;
        _logger = logger;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            _logger.LogInformation("Processing login for: {EmailOrUsername}", request.EmailOrUsername);

            // DIP: Usa factory para obtener dependencias sin conocer implementaciones
            var emailQueries = _repositoryFactory.GetRepository<IUserEmailQueries>();
            var usernameQueries = _repositoryFactory.GetRepository<IUserUsernameQueries>();
            var tokenService = _serviceFactory.GetTokenService();

            var user = await GetUserByEmailOrUsernameAsync(emailQueries, usernameQueries, request.EmailOrUsername);

            if (!IsValidLogin(user, request.Password))
            {
                return CreateFailureResponse("Credenciales inválidas");
            }

            if (!user!.IsActive)
            {
                return CreateFailureResponse("Usuario inactivo");
            }

            var tokenClaims = CreateTokenClaims(user);
            var token = tokenService.GenerateToken(tokenClaims);

            await UpdateUserLastLoginAsync(user);

            _logger.LogInformation("Successful login for: {EmailOrUsername}", request.EmailOrUsername);

            return CreateSuccessResponse(token, user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for: {EmailOrUsername}", request.EmailOrUsername);
            throw;
        }
    }

    // LSP: Funciona con cualquier implementación que respete los contratos
    private async Task<User?> GetUserByEmailOrUsernameAsync(
        IUserEmailQueries emailQueries, 
        IUserUsernameQueries usernameQueries, 
        string emailOrUsername)
    {
        var user = await emailQueries.GetByEmailAsync(emailOrUsername);
        return user ?? await usernameQueries.GetByUsernameAsync(emailOrUsername);
    }

    private static bool IsValidLogin(User? user, string password)
    {
        return user != null && BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    private async Task UpdateUserLastLoginAsync(User user)
    {
        try
        {
            // DIP: Usa abstracción para actualizar
            var writeRepo = _repositoryFactory.GetRepository<Domain.Interfaces.Repository.IWriteRepository<User>>();
            user.LastLoginAt = DateTime.UtcNow;
            await writeRepo.UpdateAsync(user);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to update last login for user: {UserId}", user.Id);
            // No lanza excepción - login sigue siendo válido
        }
    }

    private static TokenClaims CreateTokenClaims(User user)
    {
        return new TokenClaims
        {
            UserId = user.Id,
            Email = user.Email,
            Username = user.Username,
            CustomClaims = new Dictionary<string, string>
            {
                ["role"] = user.Role.ToString(),
                ["fullName"] = $"{user.FirstName} {user.LastName}"
            }
        };
    }

    private static AuthResponseDto CreateFailureResponse(string message)
    {
        return new AuthResponseDto
        {
            Success = false,
            Message = message,
            Token = string.Empty,
            User = null
        };
    }

    private static AuthResponseDto CreateSuccessResponse(string token, User user)
    {
        return new AuthResponseDto
        {
            Success = true,
            Token = token,
            Message = "Login exitoso",
            User = MapToUserDto(user)
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
            UpdatedAt = user.UpdatedAt,
            LastLoginAt = user.LastLoginAt
        };
    }
}
