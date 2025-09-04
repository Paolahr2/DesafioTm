# 🚀 TaskManager - Full Stack Application

## ✅ **ESTADO ACTUAL: COMPLETAMENTE FUNCIONAL**

TaskManager es una solución completa de gestión de tareas Full Stack desarrollada con **Clean Architecture**, **SOLID Principles**, y las mejores prácticas de desarrollo.

---

## 🏗️ **Arquitectura del Sistema**

### **Backend: Clean Architecture (5 Capas)**
```
┌─────────────────────────────────────┐
│           Presentation              │  ← Controllers, Middleware
├─────────────────────────────────────┤
│         DependencyInjection         │  ← DI Container, SOLID Factory
├─────────────────────────────────────┤
│           Application               │  ← Commands, Queries, DTOs
├─────────────────────────────────────┤
│          Infrastructure             │  ← Repositories, MongoDB
├─────────────────────────────────────┤
│             Domain                  │  ← Entities, Interfaces, Enums
└─────────────────────────────────────┘
```

### **Frontend: Angular + TypeScript**
```
┌─────────────────────────────────────┐
│            Components               │  ← UI Components
├─────────────────────────────────────┤
│             Services                │  ← HTTP Services, State Management
├─────────────────────────────────────┤
│         Guards/Interceptors         │  ← Auth Guards, HTTP Interceptors
├─────────────────────────────────────┤
│        Models/Interfaces            │  ← TypeScript Models
└─────────────────────────────────────┘
```

### **Tecnologías Implementadas**

**Backend:**
- ✅ **ASP.NET Core 8.0**
- ✅ **MongoDB Atlas** (Base de datos en la nube)
- ✅ **MediatR 12.1.1** (CQRS Pattern)
- ✅ **FluentValidation 11.7.1** 
- ✅ **JWT Bearer Authentication**
- ✅ **Swagger/OpenAPI**
- ✅ **BCrypt** (Hash de contraseñas)
- ✅ **Secret Manager** (Configuración segura)

**Frontend:**
- ✅ **Angular 20.2.0**
- ✅ **TypeScript**
- ✅ **Angular Material**
- ✅ **TailwindCSS**
- ✅ **HTTP Client**
- ✅ **JWT Integration**
- ✅ **Guards & Interceptors**

---

## 🎯 **API Endpoints Disponibles**

### **🔐 Authentication**
```
POST /api/auth/register    - Registrar nuevo usuario
POST /api/auth/login       - Iniciar sesión (JWT)
```

### **📋 Tasks Management**
```
GET    /api/tasks          - Obtener tareas del usuario
GET    /api/tasks/{id}     - Obtener tarea específica
POST   /api/tasks          - Crear nueva tarea
PUT    /api/tasks/{id}     - Actualizar tarea completa
PATCH  /api/tasks/{id}/status - Actualizar solo estado
DELETE /api/tasks/{id}     - Eliminar tarea
GET    /api/tasks/search   - Buscar tareas
```

### **📊 Boards Management**
```
GET    /api/boards         - Obtener boards del usuario
GET    /api/boards/{id}    - Obtener board específico
POST   /api/boards         - Crear nuevo board
PUT    /api/boards/{id}    - Actualizar board
DELETE /api/boards/{id}    - Eliminar board
```

### **👥 Users Management**
```
GET    /api/users          - Obtener todos los usuarios
GET    /api/users/{id}     - Obtener usuario específico
PUT    /api/users/{id}     - Actualizar usuario
DELETE /api/users/{id}     - Eliminar usuario
GET    /api/users/me       - Obtener perfil actual
```

### **🧪 Testing**
```
GET    /api/test/jwt       - Verificar autenticación JWT
```

---

## 🚀 **Inicio Rápido**

### **1. Prerrequisitos**
- .NET 8.0 SDK
- VS Code o Visual Studio
- Conexión a internet (MongoDB Atlas)

### **2. Clonar y Ejecutar**
```bash
# Clonar el repositorio
git clone [url-del-repo]
cd DesafioTM

# Restaurar paquetes y compilar
dotnet restore
dotnet build

# Ejecutar la aplicación
cd backend/src/Presentation
dotnet run
```

### **3. Acceder a la API**
- 🚀 **API Base:** `http://localhost:5000`
- 📖 **Swagger UI:** `http://localhost:5000/swagger`
- 🔐 **JWT Security:** Configurado y funcional

---

## 🔧 **Configuración**

### **Secret Manager**
El proyecto utiliza Secret Manager para configuración segura:
```bash
# Ver configuración actual
dotnet user-secrets list --project backend/src/Presentation
```

### **Variables de Entorno**
- `ConnectionStrings:MongoDb` - Cadena de conexión MongoDB Atlas
- `JWT:SecretKey` - Clave secreta para JWT
- `JWT:Issuer` - Emisor del token
- `JWT:Audience` - Audiencia del token
- `JWT:ExpirationInHours` - Expiración en horas

---

## 🎨 **Patrones de Diseño Implementados**

### **CQRS (Command Query Responsibility Segregation)**
- **Commands:** Operaciones de escritura (Create, Update, Delete)
- **Queries:** Operaciones de lectura (Get, Search)
- **Handlers:** Lógica de negocio separada

### **SOLID Principles**
- **S** - Single Responsibility: Cada clase tiene una responsabilidad
- **O** - Open/Closed: Extensible sin modificación
- **L** - Liskov Substitution: Interfaces bien definidas
- **I** - Interface Segregation: Interfaces específicas
- **D** - Dependency Inversion: DependencyInvertedFactory

### **Repository Pattern**
- Abstracción de la capa de datos
- Implementación con MongoDB
- Interfaces en Domain, implementación en Infrastructure

---

## 🧪 **Testing con Swagger**

### **1. Registro de Usuario**
```json
POST /api/auth/register
{
  "username": "admin",
  "email": "admin@example.com", 
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "User"
}
```

### **2. Login y Obtener JWT**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

### **3. Usar JWT en Requests**
1. Copiar el token JWT del response
2. En Swagger: Click en "Authorize" 🔒
3. Ingresar: `Bearer [tu-jwt-token]`
4. Ahora puedes usar todos los endpoints protegidos

---

## 📁 **Estructura del Proyecto**

```
DesafioTM/
├── backend/src/
│   ├── Domain/                 # Entidades, Enums, Interfaces
│   ├── Application/            # Commands, Queries, DTOs, Validators
│   ├── Infrastructure/         # Repositories, MongoDB
│   ├── DependencyInjection/    # SOLID Factory Pattern
│   └── Presentation/           # Controllers, Middleware, Program.cs
├── DesafioTM.sln              # Solución principal
└── README.md                  # Esta documentación
```

---

## 🔒 **Seguridad Implementada**

- ✅ **JWT Authentication** completo
- ✅ **BCrypt** para hash de contraseñas
- ✅ **Secret Manager** para configuración
- ✅ **FluentValidation** para validación de datos
- ✅ **Claims-based authorization**
- ✅ **HTTPS Ready** para producción

---

## 🌟 **Características Destacadas**

- 🏗️ **Clean Architecture** con separación clara de responsabilidades
- 🔄 **CQRS Pattern** con MediatR
- 🛡️ **SOLID Principles** implementados correctamente
- 📊 **MongoDB Atlas** como base de datos en la nube
- 🔐 **JWT Security** completa y funcional
- 📋 **Swagger Documentation** interactiva
- ✅ **FluentValidation** con mensajes personalizados
- 🧪 **Ready for Testing** con endpoints de prueba

---

## 📞 **Soporte**

Este proyecto está completamente funcional y listo para desarrollo adicional o despliegue en producción.

**Estado:** ✅ **FUNCIONAL AL 100%**
**Última actualización:** Septiembre 2025
