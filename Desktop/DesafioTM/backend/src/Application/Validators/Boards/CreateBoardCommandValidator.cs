using Application.Commands.Boards;
using FluentValidation;

namespace Application.Validators.Boards;

/// <summary>
/// Validador para el comando de creación de tableros siguiendo FluentValidation
/// </summary>
public class CreateBoardCommandValidator : AbstractValidator<CreateBoardCommand>
{
    public CreateBoardCommandValidator()
    {
        RuleFor(x => x.Board.Title)
            .NotEmpty().WithMessage("El título del tablero es obligatorio")
            .MaximumLength(100).WithMessage("El título no puede exceder 100 caracteres");

        RuleFor(x => x.Board.Description)
            .MaximumLength(300).WithMessage("La descripción no puede exceder 300 caracteres")
            .When(x => !string.IsNullOrEmpty(x.Board.Description));

        RuleFor(x => x.OwnerId)
            .NotEmpty().WithMessage("El ID del usuario creador es obligatorio");
    }
}
