using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces;
using Application.DTOs;
using Domain.Entities;
using Domain.Enums;

namespace Api.Controllers;

/// <summary>
/// Controlador para la gestión de tareas Kanban
/// Implementa operaciones CRUD con reglas de negocio específicas
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _taskRepository;
    private readonly IBoardRepository _boardRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<TasksController> _logger;

    public TasksController(
        ITaskRepository taskRepository,
        IBoardRepository boardRepository,
        IUserRepository userRepository,
        ILogger<TasksController> logger)
    {
        _taskRepository = taskRepository;
        _boardRepository = boardRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todas las tareas de un tablero
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TaskResponseDto>), 200)]
    public async Task<ActionResult<IEnumerable<TaskResponseDto>>> GetTasks([FromQuery] string boardId, [FromQuery] string userId)
    {
        try
        {
            if (string.IsNullOrEmpty(boardId))
            {
                return BadRequest("BoardId es requerido");
            }

            // Verificar acceso al tablero
            if (!await _boardRepository.UserHasAccessAsync(boardId, userId))
            {
                return Forbid("No tienes acceso a este tablero");
            }

            var tasks = await _taskRepository.GetTasksByBoardIdAsync(boardId);
            
            var taskDtos = tasks.Select(t => new TaskResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                CreatedBy = t.CreatedBy,
                AssignedTo = t.AssignedTo,
                BoardId = t.BoardId,
                DueDate = t.DueDate,
                Tags = t.Tags,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                Position = t.Position
            });

            return Ok(taskDtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tareas del tablero {BoardId}", boardId);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Crea una nueva tarea
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(TaskResponseDto), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<TaskResponseDto>> CreateTask([FromBody] CreateTaskRequestDto createTaskDto)
    {
        try
        {
            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(createTaskDto.Title))
            {
                return BadRequest("El título de la tarea es requerido");
            }

            // Verificar que el usuario creador existe
            var creator = await _userRepository.GetByIdAsync(createTaskDto.CreatedBy);
            if (creator == null || !creator.IsActive)
            {
                return BadRequest("El usuario creador no existe o está inactivo");
            }

            // Verificar acceso al tablero
            if (!await _boardRepository.UserHasAccessAsync(createTaskDto.BoardId, createTaskDto.CreatedBy))
            {
                return Forbid("No tienes acceso a este tablero");
            }

            // Verificar usuario asignado si se especifica
            if (!string.IsNullOrEmpty(createTaskDto.AssignedTo))
            {
                var assignedUser = await _userRepository.GetByIdAsync(createTaskDto.AssignedTo);
                if (assignedUser == null || !assignedUser.IsActive)
                {
                    return BadRequest("El usuario asignado no existe o está inactivo");
                }

                // Verificar que el usuario asignado tenga acceso al tablero
                if (!await _boardRepository.UserHasAccessAsync(createTaskDto.BoardId, createTaskDto.AssignedTo))
                {
                    return BadRequest("El usuario asignado no tiene acceso al tablero");
                }
            }

            // Crear tarea
            var task = new TaskItem(
                createTaskDto.Title,
                createTaskDto.CreatedBy,
                createTaskDto.BoardId,
                createTaskDto.Description
            );

            // Configurar propiedades adicionales
            if (createTaskDto.Priority.HasValue)
                task.Priority = createTaskDto.Priority.Value;

            if (!string.IsNullOrEmpty(createTaskDto.AssignedTo))
                task.AssignTo(createTaskDto.AssignedTo);

            if (createTaskDto.DueDate.HasValue)
                task.DueDate = createTaskDto.DueDate.Value;

            // Agregar tags
            foreach (var tag in createTaskDto.Tags)
            {
                if (!string.IsNullOrWhiteSpace(tag))
                    task.AddTag(tag);
            }

            var createdTask = await _taskRepository.CreateAsync(task);

            var taskDto = new TaskResponseDto
            {
                Id = createdTask.Id,
                Title = createdTask.Title,
                Description = createdTask.Description,
                Status = createdTask.Status,
                Priority = createdTask.Priority,
                CreatedBy = createdTask.CreatedBy,
                AssignedTo = createdTask.AssignedTo,
                BoardId = createdTask.BoardId,
                DueDate = createdTask.DueDate,
                Tags = createdTask.Tags,
                CreatedAt = createdTask.CreatedAt,
                UpdatedAt = createdTask.UpdatedAt,
                Position = createdTask.Position
            };

            return CreatedAtAction(nameof(GetTask), new { id = taskDto.Id, userId = createTaskDto.CreatedBy }, taskDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear tarea");
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Obtiene una tarea específica
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TaskResponseDto), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<TaskResponseDto>> GetTask(string id, [FromQuery] string userId)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(id);
            
            if (task == null)
            {
                return NotFound($"Tarea con ID {id} no encontrada");
            }

            // Verificar acceso al tablero
            if (!await _boardRepository.UserHasAccessAsync(task.BoardId, userId))
            {
                return Forbid("No tienes acceso a esta tarea");
            }

            var taskDto = new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                CreatedBy = task.CreatedBy,
                AssignedTo = task.AssignedTo,
                BoardId = task.BoardId,
                DueDate = task.DueDate,
                Tags = task.Tags,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                Position = task.Position
            };

            return Ok(taskDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener tarea {TaskId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Elimina una tarea
    /// REGLA DE NEGOCIO: Solo el creador puede eliminar la tarea y no se pueden eliminar tareas completadas
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<ActionResult> DeleteTask(string id, [FromQuery] string userId)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(id);
            
            if (task == null)
            {
                return NotFound($"Tarea con ID {id} no encontrada");
            }

            // REGLA DE NEGOCIO: Solo el creador puede eliminar la tarea
            if (!task.CanBeDeletedBy(userId))
            {
                return Forbid("Solo el creador de la tarea puede eliminarla");
            }

            // REGLA DE NEGOCIO: Las tareas completadas no se pueden eliminar
            if (task.Status == Domain.Enums.TaskStatus.Completed)
            {
                return BadRequest("No se pueden eliminar tareas completadas");
            }

            // Eliminar tarea
            var deleted = await _taskRepository.DeleteAsync(id);
            
            if (!deleted)
            {
                return BadRequest("No se pudo eliminar la tarea");
            }

            _logger.LogInformation("Tarea {TaskId} eliminada por usuario {UserId}", id, userId);

            return Ok(new
            {
                Message = "Tarea eliminada exitosamente",
                TaskId = id,
                DeletedBy = userId,
                DeletedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar tarea {TaskId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Actualiza una tarea
    /// REGLA DE NEGOCIO: Las tareas completadas no se pueden editar
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(TaskResponseDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<TaskResponseDto>> UpdateTask(string id, [FromBody] UpdateTaskDto updateTaskDto, [FromQuery] string userId)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(id);
            
            if (task == null)
            {
                return NotFound($"Tarea con ID {id} no encontrada");
            }

            // Verificar acceso al tablero
            if (!await _boardRepository.UserHasAccessAsync(task.BoardId, userId))
            {
                return Forbid("No tienes acceso a esta tarea");
            }

            // REGLA DE NEGOCIO: Las tareas completadas no se pueden editar
            if (task.Status == Domain.Enums.TaskStatus.Completed)
            {
                return BadRequest("No se pueden editar tareas completadas");
            }

            // Solo el creador o el asignado pueden editar la tarea
            if (task.CreatedBy != userId && task.AssignedTo != userId)
            {
                return Forbid("Solo el creador o el usuario asignado pueden editar esta tarea");
            }

            try
            {
                // Actualizar información básica
                task.UpdateInfo(
                    updateTaskDto.Title,
                    updateTaskDto.Description,
                    updateTaskDto.Priority,
                    updateTaskDto.DueDate
                );

                // Actualizar asignación si se especifica
                if (updateTaskDto.AssignedTo != task.AssignedTo)
                {
                    if (string.IsNullOrEmpty(updateTaskDto.AssignedTo))
                    {
                        task.Unassign();
                    }
                    else
                    {
                        // Verificar que el nuevo usuario asignado existe y tiene acceso
                        var assignedUser = await _userRepository.GetByIdAsync(updateTaskDto.AssignedTo);
                        if (assignedUser == null || !assignedUser.IsActive)
                        {
                            return BadRequest("El usuario asignado no existe o está inactivo");
                        }

                        if (!await _boardRepository.UserHasAccessAsync(task.BoardId, updateTaskDto.AssignedTo))
                        {
                            return BadRequest("El usuario asignado no tiene acceso al tablero");
                        }

                        task.AssignTo(updateTaskDto.AssignedTo);
                    }
                }

                var updatedTask = await _taskRepository.UpdateAsync(task);

                var taskDto = new TaskResponseDto
                {
                    Id = updatedTask.Id,
                    Title = updatedTask.Title,
                    Description = updatedTask.Description,
                    Status = updatedTask.Status,
                    Priority = updatedTask.Priority,
                    CreatedBy = updatedTask.CreatedBy,
                    AssignedTo = updatedTask.AssignedTo,
                    BoardId = updatedTask.BoardId,
                    DueDate = updatedTask.DueDate,
                    Tags = updatedTask.Tags,
                    CreatedAt = updatedTask.CreatedAt,
                    UpdatedAt = updatedTask.UpdatedAt,
                    Position = updatedTask.Position
                };

                return Ok(taskDto);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar tarea {TaskId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }

    /// <summary>
    /// Cambia el estado de una tarea
    /// </summary>
    [HttpPatch("{id}/status")]
    [ProducesResponseType(typeof(TaskResponseDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(403)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<TaskResponseDto>> ChangeTaskStatus(string id, [FromBody] ChangeTaskStatusDto statusDto, [FromQuery] string userId)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(id);
            
            if (task == null)
            {
                return NotFound($"Tarea con ID {id} no encontrada");
            }

            // Verificar acceso al tablero
            if (!await _boardRepository.UserHasAccessAsync(task.BoardId, userId))
            {
                return Forbid("No tienes acceso a esta tarea");
            }

            // Solo el creador o el asignado pueden cambiar el estado
            if (task.CreatedBy != userId && task.AssignedTo != userId)
            {
                return Forbid("Solo el creador o el usuario asignado pueden cambiar el estado de la tarea");
            }

            // Cambiar estado
            task.ChangeStatus(statusDto.NewStatus);
            var updatedTask = await _taskRepository.UpdateAsync(task);

            var taskDto = new TaskResponseDto
            {
                Id = updatedTask.Id,
                Title = updatedTask.Title,
                Description = updatedTask.Description,
                Status = updatedTask.Status,
                Priority = updatedTask.Priority,
                CreatedBy = updatedTask.CreatedBy,
                AssignedTo = updatedTask.AssignedTo,
                BoardId = updatedTask.BoardId,
                DueDate = updatedTask.DueDate,
                Tags = updatedTask.Tags,
                CreatedAt = updatedTask.CreatedAt,
                UpdatedAt = updatedTask.UpdatedAt,
                Position = updatedTask.Position
            };

            _logger.LogInformation("Estado de tarea {TaskId} cambiado a {NewStatus} por usuario {UserId}", 
                                 id, statusDto.NewStatus, userId);

            return Ok(taskDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al cambiar estado de tarea {TaskId}", id);
            return StatusCode(500, "Error interno del servidor");
        }
    }
}
