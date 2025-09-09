using Application.Commands.Tasks;
using Application.DTOs;
using Application.Queries.Tasks;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TaskManager.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
[Tags("Tasks")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// CREAR una nueva tarea
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask([FromBody] CreateTaskDto taskDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new CreateTaskCommand(taskDto, userId);
            var result = await _mediator.Send(command);
            
            return CreatedAtAction(nameof(GetTaskById), new { id = result.Id }, result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// OBTENER una tarea por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTaskById(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var query = new GetTaskByIdQuery(id, userId);
            var task = await _mediator.Send(query);

            if (task == null)
                return NotFound(new { message = "Tarea no encontrada o sin acceso" });

            return Ok(task);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// OBTENER todas las tareas de un tablero
    /// </summary>
    [HttpGet("board/{boardId}")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetBoardTasks(string boardId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var query = new GetBoardTasksQuery(boardId, userId);
            var tasks = await _mediator.Send(query);

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// OBTENER tareas asignadas al usuario actual
    /// </summary>
    [HttpGet("my-tasks")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetMyTasks([FromQuery] Domain.Enums.TaskStatus? status = null)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var query = new GetUserTasksQuery(userId, status);
            var tasks = await _mediator.Send(query);

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// OBTENER tareas creadas por el usuario
    /// </summary>
    [HttpGet("created-by-me")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> GetCreatedTasks()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var query = new GetCreatedTasksQuery(userId);
            var tasks = await _mediator.Send(query);

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// ACTUALIZAR una tarea
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(string id, [FromBody] UpdateTaskDto taskDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new UpdateTaskCommand(id, taskDto, userId);
            var result = await _mediator.Send(command);

            if (result == null)
                return NotFound(new { message = "Tarea no encontrada o sin permisos para actualizar" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// CAMBIAR el estado de una tarea
    /// </summary>
    [HttpPatch("{id}/status")]
    public async Task<ActionResult<TaskDto>> ChangeTaskStatus(string id, [FromBody] UpdateTaskStatusDto statusDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new ChangeTaskStatusCommand(id, statusDto.Status, userId);
            var result = await _mediator.Send(command);

            if (result == null)
                return NotFound(new { message = "Tarea no encontrada o sin permisos para cambiar estado" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// ELIMINAR una tarea
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new DeleteTaskCommand(id, userId);
            var result = await _mediator.Send(command);

            if (!result)
                return NotFound(new { message = "Tarea no encontrada o sin permisos para eliminar" });

            return Ok(new { message = "Tarea eliminada exitosamente" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// BUSCAR tareas
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<TaskDto>>> SearchTasks([FromQuery] string query)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(new { message = "Query de búsqueda requerido" });

            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var searchQuery = new SearchTasksQuery(query, userId);
            var tasks = await _mediator.Send(searchQuery);

            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
