# 🔍 FLUENTVALIDATION EN SWAGGER - GUÍA COMPLETA

## ❌ Lo que NO se muestra en Swagger UI:
- Mensajes de validación personalizados de FluentValidation
- Reglas específicas de validación (longitud mínima/máxima)
- Condiciones complejas de validación
- Mensajes de error detallados

## ✅ Lo que SÍ se muestra en Swagger UI:
- Estructura básica del modelo
- Tipos de datos (string, int, bool, etc.)
- Propiedades requeridas (con `[Required]`)
- Ejemplos básicos de los DTOs

## 🧪 Para ver los mensajes de FluentValidation:

### 1. Hacer un Request HTTP con datos inválidos
```bash
# Ejemplo: Registro con datos inválidos
curl -X POST "http://localhost:5000/api/Auth/register" \
     -H "Content-Type: application/json" \
     -d "{
       \"Email\": \"email-invalido\",
       \"Password\": \"123\",
       \"FirstName\": \"\",
       \"LastName\": \"\"
     }"
```

### 2. La respuesta mostrará los mensajes de FluentValidation:
```json
{
  "type": "ValidationException",
  "title": "Validation failed",
  "status": 400,
  "errors": {
    "Email": ["Email format is invalid"],
    "Password": ["Password must be at least 8 characters long"],
    "FirstName": ["FirstName is required"],
    "LastName": ["LastName is required"]
  }
}
```

## 🎯 Cómo probar FluentValidation:

### Opción 1: Desde Swagger UI
1. Ve a http://localhost:5000/swagger
2. Busca el endpoint `POST /api/Auth/register`
3. Haz clic en "Try it out"
4. Ingresa datos inválidos en el JSON
5. Ejecuta la petición
6. Ve la respuesta con los mensajes de validación

### Opción 2: Desde PowerShell
```powershell
$body = @{
    Email = "email-invalido"
    Password = "123"
    FirstName = ""
    LastName = ""
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/Auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)"
    $response.Content
} catch {
    Write-Host "❌ Validation Errors:"
    $_.Exception.Response.GetResponseStream() | ForEach-Object { 
        $reader = New-Object System.IO.StreamReader($_)
        $reader.ReadToEnd() 
    }
}
```

### Opción 3: Usar los archivos JSON de prueba existentes
```powershell
# Datos inválidos
$invalidData = Get-Content "C:\Users\USER\Desktop\DesafioTM\invalid-register.json" | ConvertFrom-Json

# Hacer request
Invoke-WebRequest -Uri "http://localhost:5000/api/Auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body (ConvertTo-Json $invalidData) -UseBasicParsing
```

## 🔧 Configuración actual de FluentValidation:

✅ **ValidationBehavior**: Intercepta requests antes de llegar al handler
✅ **Pipeline de MediatR**: Integrado con el comportamiento de validación
✅ **Mensajes personalizados**: Configurados en los validadores
✅ **Respuestas estructuradas**: Formato JSON consistente para errores

## 📝 Validadores implementados:
- RegisterCommandValidator
- LoginCommandValidator  
- CreateBoardCommandValidator
- CreateTaskCommandValidator
- UpdateTaskCommandValidator

## 🎯 Resumen:
**Swagger UI** = Vista de la estructura de la API
**HTTP Requests** = Lugar donde ves los mensajes de FluentValidation en acción

¡Los mensajes de validación solo aparecen cuando haces requests HTTP reales con datos que violan las reglas!
