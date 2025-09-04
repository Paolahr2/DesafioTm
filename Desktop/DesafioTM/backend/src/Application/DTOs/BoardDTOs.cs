using System.ComponentModel.DataAnnotations;

namespace Application.DTOs;

// DTOs para tableros
public class BoardDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public List<string> MemberIds { get; set; } = new();
    public string Color { get; set; } = string.Empty;
    public bool IsArchived { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateBoardDto
{
    [Required(ErrorMessage = "El título es requerido")]
    [StringLength(100, ErrorMessage = "El título no puede exceder 100 caracteres")]
    public string Title { get; set; } = string.Empty;

    [StringLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
    public string Description { get; set; } = string.Empty;

    public string Color { get; set; } = "#3B82F6";
    public bool IsPublic { get; set; } = false;
}

public class UpdateBoardDto
{
    [StringLength(100, ErrorMessage = "El título no puede exceder 100 caracteres")]
    public string? Title { get; set; }

    [StringLength(500, ErrorMessage = "La descripción no puede exceder 500 caracteres")]
    public string? Description { get; set; }

    public string? Color { get; set; }
    public bool? IsPublic { get; set; }
}
