# 🚀 TaskManager - Guía de Ejecución

## ⚡ Inicio Rápido

### 🔧 Prerrequisitos
- **.NET 8.0 SDK** instalado
- **Node.js 18+** instalado
- **MongoDB Atlas** configurado (ya está configurado)

---

## 🖥️ **Ejecutar Backend (API)**

```bash
# 1. Navegar al directorio del backend
cd backend/src/Presentation

# 2. Restaurar dependencias (si es necesario)
dotnet restore

# 3. Ejecutar la API
dotnet run
```

**Backend disponible en:**
- 🌐 **API:** `http://localhost:5000`
- 📖 **Swagger:** `http://localhost:5000/swagger`

---

## 🎨 **Ejecutar Frontend (Angular)**

```bash
# 1. Navegar al directorio del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Ejecutar el frontend
npm start
# o
ng serve
```

**Frontend disponible en:**
- 🌐 **App:** `http://localhost:4200`

---

## 🔗 **Ejecución Full Stack**

### **Terminal 1 - Backend:**
```bash
cd backend/src/Presentation
dotnet run
```

### **Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 🔑 **Configuración de Entornos**

### **Backend**
- Configurado con **Secret Manager**
- JWT y MongoDB Atlas ya configurados
- No se requiere configuración adicional

### **Frontend**
- `frontend/src/environments/environment.ts` - Desarrollo
- `frontend/src/environments/environment.prod.ts` - Producción

---

## 🎯 **Funcionalidades Integradas**

### **Backend API (Puerto 5000)**
- ✅ **Autenticación JWT**
- ✅ **CRUD Completo:** Users, Tasks, Boards
- ✅ **Validación con FluentValidation**
- ✅ **MongoDB Atlas**
- ✅ **Swagger Documentation**

### **Frontend Angular (Puerto 4200)**
- ✅ **Componentes Angular Material**
- ✅ **Servicios HTTP integrados**
- ✅ **Guards de autenticación**
- ✅ **Interceptors JWT**
- ✅ **Models/Interfaces TypeScript**

---

## 🛠️ **Comandos Útiles**

### **Backend**
```bash
dotnet build          # Compilar
dotnet clean          # Limpiar
dotnet test           # Ejecutar tests
```

### **Frontend**
```bash
ng build              # Compilar para producción
ng test               # Ejecutar tests
ng lint               # Verificar código
```

---

## 🔧 **Solución de Problemas**

### **Si el backend no inicia:**
1. Verificar que el puerto 5000 esté libre
2. Ejecutar `dotnet clean && dotnet build`
3. Verificar Secret Manager: `dotnet user-secrets list`

### **Si el frontend no inicia:**
1. Eliminar `node_modules`: `rm -rf node_modules`
2. Reinstalar: `npm install`
3. Verificar versión de Node: `node --version`

---

## 📞 **URLs Importantes**

- **Backend API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger
- **Frontend App:** http://localhost:4200
- **MongoDB Atlas:** Configurado via Secret Manager
