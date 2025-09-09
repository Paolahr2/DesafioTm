using Application.Commands.Boards;
using Application.DTOs;
using Application.Queries.Boards;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TaskManager.Controllers;

[ApiController]
[Route("api/boards")]
[Authorize]
[Tags("Boards")]
public class BoardsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BoardsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Obtiene todos los tableros del usuario
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<BoardDto>), 200)]
    public async Task<ActionResult<List<BoardDto>>> GetBoards()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var query = new GetUserBoardsQuery(userId);
        var boards = await _mediator.Send(query);
        return Ok(boards);
    }

    /// <summary>
    /// Obtiene un tablero por su ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(BoardDto), 200)]
    public async Task<ActionResult<BoardDto>> GetBoardById(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var query = new GetBoardByIdQuery(id, userId);
        var board = await _mediator.Send(query);
        return board != null ? Ok(board) : NotFound();
    }

    /// <summary>
    /// Crea un nuevo tablero
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(BoardDto), 201)]
    public async Task<ActionResult<BoardDto>> CreateBoard([FromBody] CreateBoardDto boardDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var command = new CreateBoardCommand(boardDto, userId);
        var result = await _mediator.Send(command) as BoardDto;
        return CreatedAtAction(nameof(GetBoardById), new { id = result?.Id }, result);
    }

    /// <summary>
    /// Actualiza un tablero existente
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(BoardDto), 200)]
    public async Task<ActionResult<BoardDto>> UpdateBoard(string id, [FromBody] UpdateBoardDto boardDto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var command = new UpdateBoardCommand(id, boardDto, userId);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    /// <summary>
    /// Elimina un tablero
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    public async Task<ActionResult> DeleteBoard(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var command = new DeleteBoardCommand(id, userId);
        await _mediator.Send(command);
        return NoContent();
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? 
            throw new UnauthorizedAccessException("Usuario no autenticado");
    }
}
