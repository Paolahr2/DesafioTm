using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Domain.Entities;
using Domain.Interfaces;
using BCrypt.Net;

namespace Api.Services;

/// <summary>
/// Servicio de autenticación para la aplicación
/// Maneja login, registro, generación de tokens JWT y validación de contraseñas
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Autentica un usuario con email/username y contraseña
    /// </summary>
    Task<AuthResult> LoginAsync(string emailOrUsername, string password);
    
    /// <summary>
    /// Registra un nuevo usuario en el sistema
    /// </summary>
    Task<AuthResult> RegisterAsync(string username, string email, string password, string fullName);
    
    /// <summary>
    /// Genera un token JWT para un usuario autenticado
    /// </summary>
    string GenerateJwtToken(User user);
    
    /// <summary>
    /// Valida un token JWT
    /// </summary>
    ClaimsPrincipal? ValidateToken(string token);
}

/// <summary>
/// Resultado de operaciones de autenticación
/// </summary>
public class AuthResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
    public User? User { get; set; }
}

/// <summary>
/// Implementación concreta del servicio de autenticación
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IUserRepository userRepository, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Implementa el login con email o username
    /// Aplica hash BCrypt para validación segura de contraseñas
    /// </summary>
    public async Task<AuthResult> LoginAsync(string emailOrUsername, string password)
    {
        try
        {
            // Buscar usuario por email o username
            User? user = null;
            
            if (emailOrUsername.Contains("@"))
            {
                user = await _userRepository.GetByEmailAsync(emailOrUsername);
            }
            else
            {
                user = await _userRepository.GetByUsernameAsync(emailOrUsername);
            }

            // Validar usuario existe y está activo
            if (user == null || !user.IsActive)
            {
                _logger.LogWarning("Intento de login fallido para {EmailOrUsername}: usuario no encontrado o inactivo", emailOrUsername);
                return new AuthResult
                {
                    Success = false,
                    Message = "Credenciales inválidas"
                };
            }

            // Validar contraseña usando BCrypt
            if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
            {
                _logger.LogWarning("Intento de login fallido para {EmailOrUsername}: contraseña incorrecta", emailOrUsername);
                return new AuthResult
                {
                    Success = false,
                    Message = "Credenciales inválidas"
                };
            }

            // Actualizar último login
            await _userRepository.UpdateLastLoginAsync(user.Id);

            // Generar token JWT
            var token = GenerateJwtToken(user);

            _logger.LogInformation("Login exitoso para usuario {UserId}", user.Id);

            return new AuthResult
            {
                Success = true,
                Message = "Login exitoso",
                Token = token,
                User = user
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante login para {EmailOrUsername}", emailOrUsername);
            return new AuthResult
            {
                Success = false,
                Message = "Error interno del servidor"
            };
        }
    }

    /// <summary>
    /// Registra un nuevo usuario con validaciones completas
    /// </summary>
    public async Task<AuthResult> RegisterAsync(string username, string email, string password, string fullName)
    {
        try
        {
            // Validar que no exista el username
            if (await _userRepository.UsernameExistsAsync(username))
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "El nombre de usuario ya existe"
                };
            }

            // Validar que no exista el email
            if (await _userRepository.EmailExistsAsync(email))
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "El email ya está registrado"
                };
            }

            // Hashear contraseña con BCrypt
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password, BCrypt.Net.BCrypt.GenerateSalt(12));

            // Crear usuario
            var user = new User(username, email, passwordHash, fullName);
            var createdUser = await _userRepository.CreateAsync(user);

            // Generar token JWT para auto-login
            var token = GenerateJwtToken(createdUser);

            _logger.LogInformation("Nuevo usuario registrado: {UserId}", createdUser.Id);

            return new AuthResult
            {
                Success = true,
                Message = "Usuario registrado exitosamente",
                Token = token,
                User = createdUser
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante registro de usuario {Username}", username);
            return new AuthResult
            {
                Success = false,
                Message = "Error interno del servidor"
            };
        }
    }

    /// <summary>
    /// Genera un token JWT con claims del usuario
    /// Incluye información básica del usuario en el token
    /// </summary>
    public string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "TM2024Dev32CharMinKey";  // Clave más corta
        var issuer = jwtSettings["Issuer"] ?? "TMAPI";       // Issuer más corto
        var audience = jwtSettings["Audience"] ?? "TMApp";    // Audience más corto
        var expireMinutes = int.Parse(jwtSettings["ExpireMinutes"] ?? "60");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new("uid", user.Id),           // NameIdentifier más corto
            new("usr", user.Username),     // Name más corto  
            new("eml", user.Email),        // Email más corto
            new("nm", user.FullName),      // FullName más corto
            new("act", user.IsActive ? "1" : "0"),  // IsActive como número
            new("rol", "u")                // Role más corto
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expireMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Valida un token JWT y retorna los claims si es válido
    /// </summary>
    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "TM2024Dev32CharMinKey";

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = jwtSettings["Issuer"] ?? "TMAPI",
                ValidateAudience = true,
                ValidAudience = jwtSettings["Audience"] ?? "TMApp",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out _);
            return principal;
        }
        catch
        {
            return null;
        }
    }
}
