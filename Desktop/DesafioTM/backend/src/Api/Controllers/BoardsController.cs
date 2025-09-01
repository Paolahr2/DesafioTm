using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Domain.Interfaces;
using Application.DTOs;
using Domain.Entities;
using System.Security.Claims;

namespace Api.Controllers;

/// <summary>
/// Controlador para la gestión de tableros Kanban
/// Implementa operaciones CRUD con reglas de negocio específicas
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
[Produces("application/json")]
public class BoardsController : ControllerBase
{
    private readonly IBoardRepository _boardRepository;
    private readonly ITaskRepository _taskRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<BoardsController> _logger;

    public BoardsController(
        IBoardRepository boardRepository,
        ITaskRepository taskRepository,
        IUserRepository userRepository,
        ILogger<BoardsController> logger)
    {
        _boardRepository = boardRepository;
        _taskRepository = taskRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los tableros accesibles para el usuario autenticado
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BoardResponseDto>), 200)]
    public async Task<ActionResult<IEnumerable<BoardResponseDto>>> GetBoards()
    {
        try
        {
            // Obtener userId del token JWT
            var userId = User.FindFirst("uid")?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Usuario no autenticado");
            }

            var boards = await _boardRepository.GetAccessibleBoardsAsync(userId);
            
            var boardDtos = boards.Select(b => new BoardResponseDto
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                OwnerId = b.OwnerId,
                Members = b.Members,
                Color = b.Color,
                CreatedAt = b.CreatedAt,
                UpdatedAt = b.UpdatedAt,
                IsActive = b.IsActive
            });

            return Ok(boardDtos);
        }
        catch (Exception ex)
        {
            var currentUserId = User.FindFirst("uid")?.Value;
            _logger.LogError(ex, "Error al obtener tableros para usuario {UserId}", currentUserId);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Obtiene un tablero específico por ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(BoardResponseDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<BoardResponseDto>> GetBoard(string id)
    {
        try
        {
            // Obtener userId del token JWT
            var userId = User.FindFirst("uid")?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Usuario no autenticado");
            }

            var board = await _boardRepository.GetByIdAsync(id);
            
            if (board == null)
            {
                return NotFound($"Tablero con ID {id} no encontrado");
            }

            // Verificar si el usuario tiene acceso al tablero
            if (board.OwnerId != userId && !board.Members.Contains(userId))
            {
                return Forbid("No tienes acceso a este tablero");
            }

            var boardDto = new BoardResponseDto
            {
                Id = board.Id,
                Name = board.Name,
                Description = board.Description,
                OwnerId = board.OwnerId,
                Members = board.Members,
                Color = board.Color,
                CreatedAt = board.CreatedAt,
                UpdatedAt = board.UpdatedAt,
                IsActive = board.IsActive
            };

            return Ok(boardDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tablero {BoardId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Crea un nuevo tablero
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(BoardResponseDto), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<BoardResponseDto>> CreateBoard([FromBody] CreateBoardRequestDto createBoardDto)
    {
        try
        {
            // Obtener userId del token JWT
            var userId = User.FindFirst("uid")?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Usuario no autenticado");
            }

            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(createBoardDto.Name))
            {
                return BadRequest("El nombre del tablero es requerido");
            }

            // Crear el tablero
            var board = new Board(
                createBoardDto.Name,
                userId, // Usar userId del token como owner
                createBoardDto.Description,
                createBoardDto.Color
            );

            var createdBoard = await _boardRepository.CreateAsync(board);

            var boardDto = new BoardResponseDto
            {
                Id = createdBoard.Id,
                Name = createdBoard.Name,
                Description = createdBoard.Description,
                OwnerId = createdBoard.OwnerId,
                Members = createdBoard.Members,
                Color = createdBoard.Color,
                CreatedAt = createdBoard.CreatedAt,
                UpdatedAt = createdBoard.UpdatedAt,
                IsActive = createdBoard.IsActive
            };

            return CreatedAtAction(nameof(GetBoard), new { id = boardDto.Id }, boardDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear tablero");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Elimina un tablero (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<ActionResult> DeleteBoard(string id)
    {
        try
        {
            // Obtener userId del token JWT
            var userId = User.FindFirst("uid")?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return BadRequest("Usuario no autenticado");
            }

            var board = await _boardRepository.GetByIdAsync(id);
            
            if (board == null)
            {
                return NotFound($"Tablero con ID {id} no encontrado");
            }

            // Verificar que solo el propietario puede eliminar
            if (board.OwnerId != userId)
            {
                return Forbid("Solo el propietario puede eliminar el tablero");
            }

            await _boardRepository.DeleteAsync(id);
            
            return Ok(new { message = "Tablero eliminado exitosamente", deletedId = id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar tablero {BoardId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
