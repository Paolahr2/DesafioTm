using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces;
using Application.DTOs;
using Domain.Entities;

namespace Api.Controllers;

/// <summary>
/// Controlador para la gestión de usuarios del sistema
/// Implementa operaciones CRUD básicas para usuarios
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UsersController> _logger;

    /// <summary>
    /// Constructor que inyecta las dependencias necesarias
    /// </summary>
    public UsersController(IUserRepository userRepository, ILogger<UsersController> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los usuarios activos del sistema
    /// </summary>
    /// <returns>Lista de usuarios activos</returns>
    /// <response code="200">Usuarios obtenidos exitosamente</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<UserResponseDto>), 200)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
    {
        try
        {
            var users = await _userRepository.GetActiveUsersAsync();
            
            var userDtos = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                FullName = u.FullName,
                CreatedAt = u.CreatedAt,
                IsActive = u.IsActive
            });

            return Ok(userDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuarios");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Obtiene un usuario específico por su ID
    /// </summary>
    /// <param name="id">ID único del usuario</param>
    /// <returns>Datos del usuario</returns>
    /// <response code="200">Usuario encontrado</response>
    /// <response code="404">Usuario no encontrado</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UserResponseDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<UserResponseDto>> GetUser(string id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            
            if (user == null)
            {
                return NotFound($"Usuario con ID {id} no encontrado");
            }

            var userDto = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive
            };

            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener usuario {UserId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Crea un nuevo usuario en el sistema
    /// </summary>
    /// <param name="createUserDto">Datos del usuario a crear</param>
    /// <returns>Usuario creado</returns>
    /// <response code="201">Usuario creado exitosamente</response>
    /// <response code="400">Datos inválidos</response>
    /// <response code="409">Usuario ya existe</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpPost]
    [ProducesResponseType(typeof(UserResponseDto), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(409)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] CreateUserDto createUserDto)
    {
        try
        {
            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(createUserDto.Username) ||
                string.IsNullOrWhiteSpace(createUserDto.Email) ||
                string.IsNullOrWhiteSpace(createUserDto.Password))
            {
                return BadRequest("Username, Email y Password son requeridos");
            }

            // Verificar si el usuario ya existe
            if (await _userRepository.UsernameExistsAsync(createUserDto.Username))
            {
                return Conflict("El nombre de usuario ya existe");
            }

            if (await _userRepository.EmailExistsAsync(createUserDto.Email))
            {
                return Conflict("El email ya está registrado");
            }

            // Por ahora, hashearemos la contraseña de forma simple (en producción usar BCrypt)
            var passwordHash = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(createUserDto.Password));

            // Crear nueva entidad User
            var user = new User(
                createUserDto.Username,
                createUserDto.Email,
                passwordHash,
                createUserDto.FullName
            );

            // Guardar en base de datos
            var createdUser = await _userRepository.CreateAsync(user);

            // Mapear a DTO de respuesta
            var userDto = new UserResponseDto
            {
                Id = createdUser.Id,
                Username = createdUser.Username,
                Email = createdUser.Email,
                FullName = createdUser.FullName,
                CreatedAt = createdUser.CreatedAt,
                IsActive = createdUser.IsActive
            };

            return CreatedAtAction(nameof(GetUser), new { id = userDto.Id }, userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear usuario");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Desactiva un usuario (soft delete)
    /// Solo se desactiva, no se elimina permanentemente para mantener integridad referencial
    /// </summary>
    /// <param name="id">ID del usuario a desactivar</param>
    /// <returns>Resultado de la operación</returns>
    /// <response code="200">Usuario desactivado exitosamente</response>
    /// <response code="404">Usuario no encontrado</response>
    /// <response code="500">Error interno del servidor</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult> DeactivateUser(string id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            
            if (user == null)
            {
                return NotFound($"Usuario con ID {id} no encontrado");
            }

            if (!user.IsActive)
            {
                return BadRequest("El usuario ya está desactivado");
            }

            // Aplicar soft delete - desactivar usuario
            user.Deactivate();
            await _userRepository.UpdateAsync(user);

            _logger.LogInformation("Usuario {UserId} desactivado exitosamente", id);
            
            return Ok(new { 
                Message = "Usuario desactivado exitosamente",
                UserId = id,
                DeactivatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al desactivar usuario {UserId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Reactiva un usuario previamente desactivado
    /// </summary>
    /// <param name="id">ID del usuario a reactivar</param>
    /// <returns>Resultado de la operación</returns>
    [HttpPatch("{id}/activate")]
    [ProducesResponseType(typeof(UserResponseDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<UserResponseDto>> ReactivateUser(string id)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(id);
            
            if (user == null)
            {
                return NotFound($"Usuario con ID {id} no encontrado");
            }

            if (user.IsActive)
            {
                return BadRequest("El usuario ya está activo");
            }

            // Reactivar usuario
            user.Activate();
            await _userRepository.UpdateAsync(user);

            var userDto = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                FullName = user.FullName,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive
            };

            _logger.LogInformation("Usuario {UserId} reactivado exitosamente", id);
            return Ok(userDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al reactivar usuario {UserId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }
}

/// <summary>
/// Controlador de prueba para verificar que la API funciona
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Endpoint de prueba para verificar que la API está funcionando
    /// </summary>
    /// <returns>Estado de la API</returns>
    [HttpGet]
    public ActionResult<object> GetHealth()
    {
        return Ok(new 
        { 
            Status = "OK",
            Message = "TaskManager API está funcionando correctamente",
            Timestamp = DateTime.UtcNow,
            Version = "1.0.0"
        });
    }
}
