using MongoDB.Driver;
using Infrastructure.Configuration;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Domain.Interfaces;
using Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configuración básica de controladores y API
builder.Services.AddControllers();

// Configuración de Swagger para documentar la API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() 
    { 
        Title = "TaskManager SWO", 
        Version = "",
        Description = ""
    });

    // Configuramos JWT Bearer para autorización en Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Ingresa el token JWT en formato: Bearer {tu_token}",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Aplicamos la seguridad JWT a todos los endpoints que lo requieran
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement()
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = Microsoft.OpenApi.Models.ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});

// Configuramos la conexión a MongoDB usando el archivo appsettings.json
builder.Services.Configure<DatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings"));

// Creamos el cliente de MongoDB como singleton para reutilizar conexiones
builder.Services.AddSingleton<IMongoClient>(serviceProvider =>
{
    var connectionString = builder.Configuration.GetConnectionString("MongoDB");
    return new MongoClient(connectionString);
});

// Registramos el contexto de MongoDB para acceder a las colecciones
builder.Services.AddScoped<MongoDbContext>();

// Inyección de dependencias para los repositorios de datos
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<IBoardRepository, BoardRepository>();

// Servicios de lógica de negocio
builder.Services.AddScoped<IAuthService, AuthService>();

// Configuramos la autenticación JWT para proteger los endpoints
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
// Clave secreta para firmar los tokens JWT
var secretKey = jwtSettings["SecretKey"] ?? "TaskManager_SecretKey_2024_Development_OnlyForTesting_MinLength32Characters";

builder.Services.AddAuthentication(options =>
{
    // Definimos JWT Bearer como esquema predeterminado
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Parámetros de validación del token JWT
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "TaskManagerAPI",
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"] ?? "TaskManagerClients",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Sin tolerancia de tiempo para expiración
    };
});

builder.Services.AddAuthorization();

// Habilitamos CORS para permitir peticiones desde el frontend en desarrollo
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCorsPolicy", builder =>
    {
        builder
            .AllowAnyOrigin()      // Permite cualquier origen
            .AllowAnyMethod()      // Permite GET, POST, PUT, DELETE, etc.
            .AllowAnyHeader();     // Permite cualquier header
    });
});

var app = builder.Build();

// Pipeline de middleware - el orden importa
if (app.Environment.IsDevelopment())
{
    // Habilitamos Swagger solo en desarrollo
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskManager API v1");
        c.RoutePrefix = "swagger"; // Swagger aparece en /swagger
    });
    app.UseCors("DevCorsPolicy");
}

app.UseHttpsRedirection();
app.UseAuthentication();  // Debe ir antes de Authorization
app.UseAuthorization();
app.MapControllers();     // Mapea los controladores

// Inicializamos MongoDB y creamos los índices necesarios para optimizar consultas
try
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
    
    // Probamos la conexión a la base de datos
    var isConnected = await context.TestConnectionAsync();
    if (isConnected)
    {
        Console.WriteLine("Conexión a MongoDB exitosa!");
        
        // Creamos índices para mejorar el rendimiento de las consultas
        await context.CreateIndexesAsync();
        Console.WriteLine("Indices de MongoDB creados correctamente!");
    }
    else
    {
        Console.WriteLine("Error: No se pudo conectar a MongoDB");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"Error inicializando MongoDB: {ex.Message}");
}

app.Run();
