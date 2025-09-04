# 🚀 SCRIPT COMPLETO PARA PROBAR API CON FLUENTVALIDATION
# ====================================================

Write-Host "🔍 INICIANDO PRUEBAS COMPLETAS DE LA API CON FLUENTVALIDATION" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Variables globales
$baseUrl = "http://localhost:5000/api"
$authToken = ""

# Función para hacer requests con mejor manejo de errores
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = "",
        [hashtable]$Headers = @{"Content-Type" = "application/json"},
        [string]$TestName
    )
    
    Write-Host "🧪 Test: $TestName" -ForegroundColor Yellow
    Write-Host "📍 $Method $Url" -ForegroundColor Gray
    
    if ($Body) {
        Write-Host "📄 Body: $Body" -ForegroundColor Gray
    }
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -Headers $Headers -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -ErrorAction Stop
        }
        
        Write-Host "✅ SUCCESS (200)" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 3
        Write-Host ""
        return @{ Success = $true; Data = $response }
    } catch {
        $statusCode = "Unknown"
        $errorDetail = $_.ErrorDetails.Message
        
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
        }
        
        if ($statusCode -eq 400) {
            Write-Host "⚠️ VALIDATION ERROR (400) - FluentValidation funcionando!" -ForegroundColor Orange
            Write-Host $errorDetail -ForegroundColor Cyan
        } elseif ($statusCode -eq 401) {
            Write-Host "🔒 UNAUTHORIZED (401)" -ForegroundColor Red  
            Write-Host $errorDetail -ForegroundColor Red
        } else {
            Write-Host "❌ ERROR ($statusCode)" -ForegroundColor Red
            Write-Host $errorDetail -ForegroundColor Red
        }
        Write-Host ""
        return @{ Success = $false; StatusCode = $statusCode; Error = $errorDetail }
    }
}

Write-Host "🔥 FASE 1: PRUEBAS DE VALIDACIÓN (FluentValidation)" -ForegroundColor Magenta
Write-Host "=================================================" -ForegroundColor Magenta

# Test 1: Register con datos inválidos (debe fallar con 400)
$invalidRegister = @{
    firstName = ""
    lastName = "Test"
    email = "email-invalido"
    username = "a" 
    password = "123"
} | ConvertTo-Json

$result1 = Invoke-ApiRequest -Url "$baseUrl/Auth/register" -Method "POST" -Body $invalidRegister -TestName "Register con datos INVÁLIDOS"

# Test 2: Login con datos inválidos (debe fallar con 400)  
$invalidLogin = @{
    emailOrUsername = ""
    password = ""
} | ConvertTo-Json

$result2 = Invoke-ApiRequest -Url "$baseUrl/Auth/login" -Method "POST" -Body $invalidLogin -TestName "Login con datos INVÁLIDOS"

Write-Host "🎯 FASE 2: REGISTRO Y AUTENTICACIÓN VÁLIDA" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta

# Test 3: Register con datos válidos (debe pasar validación)
$validRegister = @{
    firstName = "Juan Carlos"
    lastName = "Pérez López" 
    email = "juancarlos.perez@example.com"
    username = "juancarlos2025"
    password = "MiPassword123!"
} | ConvertTo-Json

$result3 = Invoke-ApiRequest -Url "$baseUrl/Auth/register" -Method "POST" -Body $validRegister -TestName "Register con datos VÁLIDOS"

if ($result3.Success) {
    $authToken = $result3.Data.token
    Write-Host "🔑 TOKEN OBTENIDO PARA PRUEBAS: $($authToken.Substring(0,50))..." -ForegroundColor Green
}

# Test 4: Login con credenciales válidas
$validLogin = @{
    emailOrUsername = "juancarlos.perez@example.com"
    password = "MiPassword123!"
} | ConvertTo-Json

$result4 = Invoke-ApiRequest -Url "$baseUrl/Auth/login" -Method "POST" -Body $validLogin -TestName "Login con credenciales VÁLIDAS"

if ($result4.Success -and !$authToken) {
    $authToken = $result4.Data.token
}

Write-Host "🏗️ FASE 3: OPERACIONES CON AUTENTICACIÓN" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

if ($authToken) {
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $authToken"
    }
    
    # Test 5: Crear Board con datos inválidos (debe fallar validación)
    $invalidBoard = @{
        title = ""
        description = "x" * 600  # Excede 500 caracteres
        color = "#FF0000"
    } | ConvertTo-Json
    
    $result5 = Invoke-ApiRequest -Url "$baseUrl/Boards" -Method "POST" -Body $invalidBoard -Headers $authHeaders -TestName "Crear Board con datos INVÁLIDOS"
    
    # Test 6: Crear Board con datos válidos
    $validBoard = @{
        title = "Mi Proyecto Importante"
        description = "Descripción del proyecto con validaciones funcionando"
        color = "#3B82F6"
        isPublic = $false
    } | ConvertTo-Json
    
    $result6 = Invoke-ApiRequest -Url "$baseUrl/Boards" -Method "POST" -Body $validBoard -Headers $authHeaders -TestName "Crear Board con datos VÁLIDOS"
    
    $boardId = ""
    if ($result6.Success) {
        $boardId = $result6.Data.id
        Write-Host "📋 BOARD CREADO ID: $boardId" -ForegroundColor Green
    }
    
    # Test 7: Crear Task con datos inválidos (debe fallar validación)
    if ($boardId) {
        $invalidTask = @{
            title = ""
            description = "x" * 600  # Excede límite
            boardId = $boardId
            priority = 99  # Valor inválido de enum
            dueDate = "2023-01-01T00:00:00Z"  # Fecha pasada
        } | ConvertTo-Json
        
        $result7 = Invoke-ApiRequest -Url "$baseUrl/Tasks" -Method "POST" -Body $invalidTask -Headers $authHeaders -TestName "Crear Task con datos INVÁLIDOS"
        
        # Test 8: Crear Task con datos válidos
        $validTask = @{
            title = "Tarea Importante"
            description = "Esta tarea tiene validaciones correctas"
            boardId = $boardId
            priority = 1  # Medium
            dueDate = "2025-12-31T23:59:59Z"
        } | ConvertTo-Json
        
        $result8 = Invoke-ApiRequest -Url "$baseUrl/Tasks" -Method "POST" -Body $validTask -Headers $authHeaders -TestName "Crear Task con datos VÁLIDOS"
    }
    
    # Test 9: Obtener todos los boards (debe funcionar)
    $result9 = Invoke-ApiRequest -Url "$baseUrl/Boards" -Method "GET" -Headers $authHeaders -TestName "Obtener todos los Boards"
    
    # Test 10: Obtener usuarios (endpoint público)
    $result10 = Invoke-ApiRequest -Url "$baseUrl/Users" -Method "GET" -TestName "Obtener usuarios (público)"
    
} else {
    Write-Host "❌ No se pudo obtener token de autenticación, saltando pruebas autenticadas" -ForegroundColor Red
}

Write-Host "📊 RESUMEN DE PRUEBAS" -ForegroundColor Magenta  
Write-Host "====================" -ForegroundColor Magenta

$validationTests = @($result1, $result2)
$authTests = @($result3, $result4)
$operationTests = @($result5, $result6, $result7, $result8, $result9, $result10)

$validationPassed = ($validationTests | Where-Object { $_.StatusCode -eq 400 }).Count
$authPassed = ($authTests | Where-Object { $_.Success -eq $true }).Count  
$operationsPassed = ($operationTests | Where-Object { $_.Success -eq $true -or $_.StatusCode -eq 400 }).Count

Write-Host "✅ Pruebas de Validación: $validationPassed/2 (errores 400 esperados)" -ForegroundColor Green
Write-Host "✅ Pruebas de Autenticación: $authPassed/2" -ForegroundColor Green
Write-Host "✅ Pruebas de Operaciones: $operationsPassed/$($operationTests.Count)" -ForegroundColor Green

if ($validationPassed -eq 2) {
    Write-Host "🎉 ¡FLUENTVALIDATION FUNCIONANDO PERFECTAMENTE!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Algunas validaciones no funcionan como esperado" -ForegroundColor Orange
}

Write-Host ""
Write-Host "🔍 Verifica Swagger UI en: http://localhost:5000/swagger" -ForegroundColor Cyan
Write-Host "✅ PRUEBAS COMPLETAS FINALIZADAS" -ForegroundColor Green
