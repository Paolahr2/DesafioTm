using Application.Commands.Boards;
using Application.DTOs;
using Application.Queries.Boards;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BoardsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BoardsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// CREAR un nuevo tablero
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<BoardDto>> CreateBoard([FromBody] CreateBoardDto boardDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new CreateBoardCommand(boardDto, userId);
            var result = await _mediator.Send(command);
            
            return CreatedAtAction(nameof(GetBoardById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// OBTENER un tablero por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<BoardDto>> GetBoardById(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var query = new GetBoardByIdQuery(id, userId);
            var board = await _mediator.Send(query);

            if (board == null)
                return NotFound(new { message = "Tablero no encontrado o sin acceso" });

            return Ok(board);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// OBTENER todos los tableros del usuario
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BoardDto>>> GetUserBoards()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var query = new GetUserBoardsQuery(userId);
            var boards = await _mediator.Send(query);

            return Ok(boards);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// OBTENER tableros públicos
    /// </summary>
    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<BoardDto>>> GetPublicBoards([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var query = new GetPublicBoardsQuery(page, pageSize);
            var boards = await _mediator.Send(query);

            return Ok(boards);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// ACTUALIZAR un tablero
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<BoardDto>> UpdateBoard(string id, [FromBody] UpdateBoardDto boardDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new UpdateBoardCommand(id, boardDto, userId);
            var result = await _mediator.Send(command);

            if (result == null)
                return NotFound(new { message = "Tablero no encontrado o sin permisos para actualizar" });

            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// ELIMINAR un tablero
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteBoard(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var command = new DeleteBoardCommand(id, userId);
            var result = await _mediator.Send(command);

            if (!result)
                return NotFound(new { message = "Tablero no encontrado o sin permisos para eliminar" });

            return Ok(new { message = "Tablero eliminado exitosamente" });
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
