using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Configurar dependencias usando tu sistema SOLID
builder.Services.AddApplicationServices(builder.Configuration);

// Configurar autenticación JWT
var jwtSettings = builder.Configuration.GetSection("JWT");
var secretKey = jwtSettings["SecretKey"] ?? "TaskManager2025-SecretKey-256bits-Required-For-HS256";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "TaskManager",
        ValidAudience = jwtSettings["Audience"] ?? "TaskManagerUsers",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configuración de tu API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "TaskManager API", 
        Version = "v1",
        Description = "API para gestión de tareas y tableros con autenticación JWT"
    });
    
    // Configurar Swagger para JWT
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando el esquema Bearer. Ejemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

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

// Configurar URLs
builder.WebHost.UseUrls("http://localhost:5000");

var app = builder.Build();

// Middleware - ORDEN IMPORTANTE
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskManager API V1");
    c.RoutePrefix = "swagger";
});

// Agregar autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

// Endpoints básicos
app.MapGet("/", () => "TaskManager API - Funcionando ✅ con JWT");
app.MapGet("/health", () => new { status = "OK", timestamp = DateTime.Now });

// Mapear todos tus controllers (Auth, Tasks, Boards, Users)
app.MapControllers();

Console.WriteLine("🚀 TaskManager API iniciado en: http://localhost:5000");
Console.WriteLine("📖 Swagger disponible en: http://localhost:5000/swagger");
Console.WriteLine("🔐 Autenticación JWT configurada");

app.Run();
