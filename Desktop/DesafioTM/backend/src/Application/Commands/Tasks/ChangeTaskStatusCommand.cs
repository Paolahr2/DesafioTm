using Application.DTOs;
using MediatR;

namespace Application.Commands.Tasks;

/// <summary>
/// Comando para cambiar el estado de una tarea
/// </summary>
public record ChangeTaskStatusCommand(string TaskId, Domain.Enums.TaskStatus Status, string UserId) : IRequest<TaskDto?>;
