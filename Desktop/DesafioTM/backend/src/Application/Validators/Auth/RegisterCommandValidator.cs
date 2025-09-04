using Application.Commands.Auth;
using FluentValidation;

namespace Application.Validators.Auth;

/// <summary>
/// Validador para el comando de registro siguiendo FluentValidation
/// </summary>
public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Request.FirstName)
            .NotEmpty().WithMessage("El nombre es obligatorio")
            .MaximumLength(50).WithMessage("El nombre no puede exceder 50 caracteres")
            .Matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$").WithMessage("El nombre solo puede contener letras y espacios");

        RuleFor(x => x.Request.LastName)
            .NotEmpty().WithMessage("El apellido es obligatorio")
            .MaximumLength(50).WithMessage("El apellido no puede exceder 50 caracteres")
            .Matches("^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$").WithMessage("El apellido solo puede contener letras y espacios");

        RuleFor(x => x.Request.Email)
            .NotEmpty().WithMessage("El email es obligatorio")
            .EmailAddress().WithMessage("El formato del email no es válido")
            .MaximumLength(100).WithMessage("El email no puede exceder 100 caracteres");

        RuleFor(x => x.Request.Username)
            .NotEmpty().WithMessage("El nombre de usuario es obligatorio")
            .MinimumLength(3).WithMessage("El nombre de usuario debe tener al menos 3 caracteres")
            .MaximumLength(30).WithMessage("El nombre de usuario no puede exceder 30 caracteres")
            .Matches("^[a-zA-Z0-9_]+$").WithMessage("El nombre de usuario solo puede contener letras, números y guiones bajos");

        RuleFor(x => x.Request.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria")
            .MinimumLength(8).WithMessage("La contraseña debe tener al menos 8 caracteres")
            .MaximumLength(50).WithMessage("La contraseña no puede exceder 50 caracteres")
            .Matches(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")
            .WithMessage("La contraseña debe contener al menos una letra minúscula, una mayúscula y un número");
    }
}
