#!/bin/bash
# Script para probar FluentValidation - Caso de error

echo "🔍 PROBANDO FLUENTVALIDATION - CASO INVÁLIDO"
echo "============================================="

# Probar registro con datos inválidos (sin campo requerido, email inválido, contraseña débil)
echo "1. Test: Register con datos inválidos"
curl -X POST "http://localhost:5000/api/Auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "",
    "lastName": "Test",
    "email": "email-invalido",
    "username": "a",
    "password": "123"
  }'

echo -e "\n\n"

# Probar login con datos inválidos
echo "2. Test: Login con datos inválidos"
curl -X POST "http://localhost:5000/api/Auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "",
    "password": ""
  }'

echo -e "\n\n"

echo "✅ Si ves errores de validación detallados arriba, FluentValidation funciona correctamente!"
