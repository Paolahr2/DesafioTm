using MediatR;
using Application.Commands.Auth;
using Application.DTOs;
using Domain.Interfaces;
using Application.Services;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Handlers.Auth;

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResultDto>
{
	private readonly Domain.Interfaces.UserRepository _userRepo;
	private readonly IJwtService _jwtService;

	public LoginCommandHandler(Domain.Interfaces.UserRepository userRepo, IJwtService jwtService)
	{
		_userRepo = userRepo;
		_jwtService = jwtService;
	}

	public async Task<LoginResultDto> Handle(LoginCommand request, CancellationToken cancellationToken)
	{
		// Buscar por username o email
		var user = await _userRepo.GetByEmailAsync(request.EmailOrUsername) ?? await _userRepo.GetByUsernameAsync(request.EmailOrUsername);
		if (user == null)
		{
			return new LoginResultDto { Success = false, Message = "Usuario no encontrado" };
		}

		// Verificar contraseña
		var valid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
		if (!valid)
		{
			return new LoginResultDto { Success = false, Message = "Credenciales inválidas" };
		}

		// Generar token
	var token = _jwtService.GenerateToken(user.Id, user.Email, user.Username);

		return new LoginResultDto
		{
			Success = true,
			Message = "Login correcto",
			Token = token,
			User = new UserDto {
				Id = user.Id,
				Username = user.Username,
				Email = user.Email,
				FullName = user.FullName,
				CreatedAt = user.CreatedAt
			}
		};
	}
}

