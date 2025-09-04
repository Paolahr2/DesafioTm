using Application.Commands.Auth;
using FluentValidation;

namespace Application.Validators.Auth;

/// <summary>
/// Validador para el comando de login siguiendo FluentValidation
/// </summary>
public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.EmailOrUsername)
            .NotEmpty().WithMessage("El email o nombre de usuario es obligatorio")
            .MaximumLength(100).WithMessage("El email o nombre de usuario no puede exceder 100 caracteres");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria")
            .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres")
            .MaximumLength(50).WithMessage("La contraseña no puede exceder 50 caracteres");
    }
}
