using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Api.Services;
using System.ComponentModel.DataAnnotations;

namespace Api.Controllers;

/// <summary>
/// Controlador de autenticación y gestión de sesiones
/// Provee endpoints para login, registro y operaciones de autenticación
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Tags("Authentication")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Autenticar usuario con email/username y contraseña
    /// </summary>
    /// <param name="request">Datos de login (email/username y contraseña)</param>
    /// <returns>Token JWT y información del usuario si es exitoso</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), 200)]
    [ProducesResponseType(typeof(ProblemDetails), 400)]
    [ProducesResponseType(typeof(ProblemDetails), 401)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.LoginAsync(request.EmailOrUsername, request.Password);

        if (!result.Success)
        {
            return Unauthorized(new { message = result.Message });
        }

        var response = new LoginResponse
        {
            Token = result.Token!,
            User = new UserDto
            {
                Id = result.User!.Id,
                Username = result.User.Username,
                Email = result.User.Email,
                FullName = result.User.FullName,
                IsActive = result.User.IsActive,
                CreatedAt = result.User.CreatedAt,
                LastLoginAt = result.User.LastLoginAt
            }
        };

        return Ok(response);
    }

    /// <summary>
    /// Registrar nuevo usuario en el sistema
    /// </summary>
    /// <param name="request">Datos de registro (username, email, contraseña, nombre completo)</param>
    /// <returns>Token JWT y información del usuario creado</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(LoginResponse), 201)]
    [ProducesResponseType(typeof(ProblemDetails), 400)]
    [ProducesResponseType(typeof(ProblemDetails), 409)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _authService.RegisterAsync(request.Username, request.Email, request.Password, request.FullName);

        if (!result.Success)
        {
            return Conflict(new { message = result.Message });
        }

        var response = new LoginResponse
        {
            Token = result.Token!,
            User = new UserDto
            {
                Id = result.User!.Id,
                Username = result.User.Username,
                Email = result.User.Email,
                FullName = result.User.FullName,
                IsActive = result.User.IsActive,
                CreatedAt = result.User.CreatedAt,
                LastLoginAt = result.User.LastLoginAt
            }
        };

        return CreatedAtAction(nameof(GetProfile), response);
    }

    /// <summary>
    /// Obtener información del perfil del usuario autenticado
    /// </summary>
    /// <returns>Información del usuario actual</returns>
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(UserDto), 200)]
    [ProducesResponseType(typeof(ProblemDetails), 401)]
    public IActionResult GetProfile()
    {
        var userId = User.FindFirst("uid")?.Value;        // Claim más corto
        var username = User.FindFirst("usr")?.Value;      // Claim más corto
        var email = User.FindFirst("eml")?.Value;         // Claim más corto
        var fullName = User.FindFirst("nm")?.Value;       // Claim más corto
        var isActive = User.FindFirst("act")?.Value == "1"; // Claim más corto

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var userDto = new UserDto
        {
            Id = userId,
            Username = username ?? "",
            Email = email ?? "",
            FullName = fullName ?? "",
            IsActive = isActive,
            CreatedAt = DateTime.UtcNow, // En producción esto vendría de la base de datos
            LastLoginAt = DateTime.UtcNow
        };

        return Ok(userDto);
    }

    /// <summary>
    /// Cerrar sesión (logout)
    /// Nota: Con JWT stateless, el logout es principalmente del lado del cliente
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(200)]
    public IActionResult Logout()
    {
        // En un sistema JWT stateless, el logout se maneja principalmente del lado del cliente
        // removiendo el token del almacenamiento local. Aquí solo confirmamos la operación.
        
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        _logger.LogInformation("Usuario {UserId} ha cerrado sesión", userId);
        
        return Ok(new { message = "Logout exitoso" });
    }

    /// <summary>
    /// Validar si un token JWT es válido
    /// </summary>
    /// <returns>Información sobre la validez del token</returns>
    [HttpGet("validate")]
    [Authorize]
    [ProducesResponseType(typeof(TokenValidationResponse), 200)]
    [ProducesResponseType(typeof(ProblemDetails), 401)]
    public IActionResult ValidateToken()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        return Ok(new TokenValidationResponse
        {
            Valid = true,
            UserId = userId,
            Message = "Token válido"
        });
    }
}

#region DTOs de Autenticación

/// <summary>
/// Datos requeridos para login
/// </summary>
public class LoginRequest
{
    [Required(ErrorMessage = "Email o nombre de usuario es requerido")]
    [StringLength(100, ErrorMessage = "Email/Username no puede exceder 100 caracteres")]
    public string EmailOrUsername { get; set; } = string.Empty;

    [Required(ErrorMessage = "Contraseña es requerida")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre 6 y 100 caracteres")]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Datos requeridos para registro
/// </summary>
public class RegisterRequest
{
    [Required(ErrorMessage = "Nombre de usuario es requerido")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "El nombre de usuario debe tener entre 3 y 50 caracteres")]
    [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "El nombre de usuario solo puede contener letras, números y guiones bajos")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email es requerido")]
    [EmailAddress(ErrorMessage = "Formato de email inválido")]
    [StringLength(100, ErrorMessage = "Email no puede exceder 100 caracteres")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Contraseña es requerida")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener entre 6 y 100 caracteres")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Nombre completo es requerido")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre completo debe tener entre 2 y 100 caracteres")]
    public string FullName { get; set; } = string.Empty;
}

/// <summary>
/// Respuesta de login exitoso
/// </summary>
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}

/// <summary>
/// DTO del usuario para respuestas de API
/// </summary>
public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

/// <summary>
/// Respuesta de validación de token
/// </summary>
public class TokenValidationResponse
{
    public bool Valid { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

#endregion
