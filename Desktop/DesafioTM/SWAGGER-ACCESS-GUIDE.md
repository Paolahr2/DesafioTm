# 📖 CÓMO ACCEDER A SWAGGER - GUÍA COMPLETA

## 🚀 MÉTODO 1: NAVEGADOR DIRECTO

1. **Ejecuta el servidor:**
   ```bash
   cd backend\src\Presentation
   dotnet run
   ```

2. **Abre tu navegador y visita:**
   ```
   http://localhost:5000/swagger
   ```

## 🔧 MÉTODO 2: ARCHIVO HTML HELPER

1. **Abre el archivo HTML creado:**
   ```
   C:\Users\USER\Desktop\DesafioTM\taskmanager-demo.html
   ```

2. **Haz doble clic** en el archivo para abrirlo en tu navegador

3. **El archivo automáticamente abrirá Swagger** después de 3 segundos

## 🌐 URLS DISPONIBLES

Cuando el servidor esté funcionando, puedes acceder a:

- **Swagger UI:** http://localhost:5000/swagger
- **Swagger JSON:** http://localhost:5000/swagger/v1/swagger.json  
- **Home:** http://localhost:5000/
- **Health Check:** http://localhost:5000/health
- **Test API:** http://localhost:5000/api/test

## 📋 DOCUMENTACIÓN DE ENDPOINTS

### 🔐 Authentication Endpoints
- `POST /api/Auth/register` - Registro de usuarios
- `POST /api/Auth/login` - Autenticación

### 👥 Users Endpoints  
- `GET /api/Users` - Listar usuarios
- `GET /api/Users/{id}` - Obtener usuario por ID
- `PUT /api/Users/{id}` - Actualizar usuario
- `DELETE /api/Users/{id}` - Eliminar usuario

### 📋 Boards Endpoints
- `GET /api/Boards` - Listar tableros
- `POST /api/Boards` - Crear tablero
- `GET /api/Boards/{id}` - Obtener tablero
- `PUT /api/Boards/{id}` - Actualizar tablero
- `DELETE /api/Boards/{id}` - Eliminar tablero

### ✅ Tasks Endpoints
- `GET /api/Tasks/board/{boardId}` - Listar tareas del tablero
- `POST /api/Tasks` - Crear tarea
- `GET /api/Tasks/{id}` - Obtener tarea
- `PUT /api/Tasks/{id}` - Actualizar tarea
- `DELETE /api/Tasks/{id}` - Eliminar tarea

## 🛠️ SOLUCIÓN DE PROBLEMAS

### ❌ Si no puedes acceder a Swagger:

1. **Verifica que el servidor esté corriendo:**
   - Busca el mensaje: "Now listening on: http://localhost:5000"

2. **Prueba URLs alternativas:**
   - http://localhost:5000/ (página principal)
   - http://localhost:5000/health (health check)

3. **Verifica el puerto:**
   ```bash
   netstat -an | findstr "5000"
   ```

4. **Reinicia el servidor:**
   ```bash
   # Mata procesos anteriores
   taskkill /F /IM dotnet.exe
   
   # Reinicia
   cd backend\src\Presentation
   dotnet run
   ```

## 🎯 LO QUE VERÁS EN SWAGGER

Una vez que accedas a Swagger UI, verás:

- **Lista de todos los endpoints** organizados por controlador
- **Documentación interactiva** con ejemplos
- **Posibilidad de probar** cada endpoint directamente
- **Esquemas de datos** para requests y responses
- **Códigos de respuesta** esperados
- **Autenticación JWT** configurada

## ✅ CONFIRMACIÓN

Si todo funciona correctamente, deberías ver:
- ✅ Interfaz de Swagger UI cargada
- ✅ Lista de endpoints de Auth, Users, Boards, Tasks
- ✅ Posibilidad de expandir cada endpoint
- ✅ Botón "Try it out" en cada endpoint
- ✅ Documentación completa de la API

¡La API TaskManager está lista para usar! 🎉
