using Domain.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

// Usuario del sistema con información de autenticación y perfil
public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public bool IsActive { get; set; } = true;
    public bool EmailConfirmed { get; set; } = false;
    public string? Avatar { get; set; }
    public DateTime? LastLoginAt { get; set; }

    // Para navegación fácil
    public string FullName => $"{FirstName} {LastName}";
}
