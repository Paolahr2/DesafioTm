using MediatR;
using Application.Commands.Auth;
using Application.DTOs;
using Domain.Interfaces;
using Domain.Entities;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Handlers.Auth;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterResultDto>
{
	private readonly Domain.Interfaces.UserRepository _userRepo;

	public RegisterCommandHandler(Domain.Interfaces.UserRepository userRepo)
	{
		_userRepo = userRepo;
	}

	public async Task<RegisterResultDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
	{
		// Verificar unicidad
		// El RegisterCommand expone Username, Email, Password, FullName
		if (await _userRepo.EmailExistsAsync(request.Email))
		{
			return new RegisterResultDto { Success = false, Message = "Email ya registrado" };
		}

		if (await _userRepo.UsernameExistsAsync(request.Username))
		{
			return new RegisterResultDto { Success = false, Message = "Username ya existe" };
		}

		// Crear usuario
		var nameParts = (request.FullName ?? string.Empty).Split(' ', 2);
		var firstName = nameParts.Length > 0 ? nameParts[0] : string.Empty;
		var lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;

		var user = new User
		{
			FirstName = firstName,
			LastName = lastName,
			Email = request.Email,
			Username = request.Username,
			PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
			CreatedAt = DateTime.UtcNow,
			UpdatedAt = DateTime.UtcNow,
			IsActive = true
		};

		var created = await _userRepo.CreateAsync(user);

		return new RegisterResultDto { Success = true, Message = "Usuario creado", UserId = user.Id };
	}
}

