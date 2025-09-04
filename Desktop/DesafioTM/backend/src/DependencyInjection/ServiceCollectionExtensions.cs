using Application.Behaviors;
using Application.Services;
using Domain.Interfaces;
using FluentValidation;
using Infrastructure.Repositories;
using Infrastructure.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MediatR;

namespace DependencyInjection;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registra todos los servicios de la aplicación
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configurar MongoDB usando Infrastructure
        services.AddMongoDatabase(configuration);

        // Agregar MediatR básico
        services.AddMediatR(cfg => {
            cfg.RegisterServicesFromAssembly(typeof(Application.Commands.Auth.RegisterCommand).Assembly);
        });

        // Configurar servicios SOLID (método local)
        ConfigureSOLIDServices(services, configuration);

        return services;
    }

    private static void ConfigureSOLIDServices(IServiceCollection services, IConfiguration configuration)
    {
        // Token service
        services.AddScoped<IJwtService, JwtService>();
        
        // Repositorios básicos
        services.AddScoped<Domain.Interfaces.UserRepository, Infrastructure.Repositories.UserRepository>();
        services.AddScoped<Domain.Interfaces.BoardRepository, Infrastructure.Repositories.BoardRepository>();
        services.AddScoped<Domain.Interfaces.TaskRepository, Infrastructure.Repositories.TaskRepository>();
    }

    /// <summary>
    /// Registra los repositorios de la capa de infraestructura
    /// </summary>
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.AddScoped<Domain.Interfaces.UserRepository, Infrastructure.Repositories.UserRepository>();
        services.AddScoped<Domain.Interfaces.BoardRepository, Infrastructure.Repositories.BoardRepository>();
        services.AddScoped<Domain.Interfaces.TaskRepository, Infrastructure.Repositories.TaskRepository>();

        return services;
    }

    /// <summary>
    /// Registra los servicios de dominio y aplicación
    /// </summary>
    public static IServiceCollection AddDomainServices(this IServiceCollection services)
    {
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}
