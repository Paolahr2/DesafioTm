using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DependencyInjection;
using Presentation.Middleware;

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

// Política CORS para desarrollo (permitir llamadas desde el frontend local)
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "LocalDev", policy =>
    {
        policy.WithOrigins("http://localhost:4300", "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configuración de tu API
builder.Services.AddControllers().AddJsonOptions(opts =>
{
    // Usar camelCase en las respuestas JSON para coincidir con el frontend
    opts.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "TaskManager API", 
        Version = "v1",
        Description = "API para gestión de tableros kanban y tareas"
    });
    
    // Configurar el orden de los tags
    c.TagActionsBy(api => new[] { api.GroupName ?? api.ActionDescriptor.RouteValues["controller"] });
    c.DocInclusionPredicate((docName, description) => true);
    c.OrderActionsBy(apiDesc => $"{apiDesc.ActionDescriptor.RouteValues["controller"]}_{apiDesc.RelativePath}");
    
    // Configurar Swagger para JWT y DTOs
    c.CustomSchemaIds(type => type.FullName);

    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header usando el esquema Bearer. Ejemplo: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
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


// Middleware de excepciones global
app.UseMiddleware<Presentation.Middleware.ExceptionMiddleware>();

// Middleware - ORDEN IMPORTANTE
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskManager API V1");
    c.RoutePrefix = "swagger";
    c.DocumentTitle = "Documentación interactiva de TaskManager API";
    c.DefaultModelsExpandDepth(-1); // Oculta el esquema de modelos por defecto
});

// Agregar autenticación y autorización
// Habilitar CORS antes de la autenticación/autorization para permitir llamadas desde el frontend
app.UseCors("LocalDev");

app.UseAuthentication();
app.UseAuthorization();

// Endpoints básicos (excluidos de Swagger)
app.MapGet("/", () => "TaskManager API - Funcionando ✅ con JWT")
    .ExcludeFromDescription();
app.MapGet("/health", () => new { status = "OK", timestamp = DateTime.Now })
    .ExcludeFromDescription();

// Mapear todos tus controllers (Auth, Tasks, Boards, Users)
app.MapControllers();

Console.WriteLine("🚀 TaskManager API iniciado en: http://localhost:5000");
Console.WriteLine("📖 Swagger disponible en: http://localhost:5000/swagger");
Console.WriteLine("🔐 Autenticación JWT configurada");

app.Run();
