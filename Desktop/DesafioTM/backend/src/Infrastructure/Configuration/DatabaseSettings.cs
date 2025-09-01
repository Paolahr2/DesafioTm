namespace Infrastructure.Configuration;

/// <summary>
/// Clase de configuración para los settings de la base de datos
/// Mapea la sección "DatabaseSettings" del appsettings.json
/// Implementa el patrón Options para inyección de dependencias
/// </summary>
public class DatabaseSettings
{
    /// <summary>
    /// Nombre de la base de datos en MongoDB
    /// Por defecto "tasksmanagerbd" según los requerimientos
    /// </summary>
    public string DatabaseName { get; set; } = "tasksmanagerbd";

    /// <summary>
    /// Nombre de la colección de usuarios en MongoDB
    /// Almacena todos los usuarios del sistema
    /// </summary>
    public string UsersCollection { get; set; } = "users";

    /// <summary>
    /// Nombre de la colección de tareas en MongoDB
    /// Almacena todas las tareas del sistema Kanban
    /// </summary>
    public string TasksCollection { get; set; } = "tasks";

    /// <summary>
    /// Nombre de la colección de tableros en MongoDB
    /// Almacena todos los tableros Kanban del sistema
    /// </summary>
    public string BoardsCollection { get; set; } = "boards";
}
