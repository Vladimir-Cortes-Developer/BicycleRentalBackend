# Guía de Solución de Problemas - Swagger UI

## Error: "Invalid or expired token" en Swagger UI

Si recibes este error al intentar usar endpoints autenticados en Swagger UI, sigue estos pasos:

### Paso 1: Obtener un Token

1. En Swagger UI, ve al endpoint **POST /auth/login** o **POST /auth/register**
2. Click en "Try it out"
3. Ingresa tus credenciales (o crea un nuevo usuario)
4. Click en "Execute"
5. En la respuesta, copia **SOLO EL TOKEN** (sin comillas), por ejemplo:

```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBmMGE..."
  }
}
```

**Copia solo:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBmMGE...`

### Paso 2: Autorizar en Swagger UI

1. Click en el botón **"Authorize"** (🔓 candado) en la parte superior derecha de Swagger UI
2. En el campo "Value", pega **SOLO EL TOKEN** (sin "Bearer ", sin comillas)
3. Click en "Authorize"
4. Click en "Close"

### ✅ CORRECTO - Haz esto:

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBmMGE...
```

**IMPORTANTE**: Debes incluir la palabra "Bearer " seguida de un espacio y luego tu token.

### ❌ INCORRECTO - NO hagas esto:

Solo el token (sin "Bearer "):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Con comillas:
```
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Paso 3: Probar un Endpoint Autenticado

1. Encuentra un endpoint con el candado 🔒 (por ejemplo, GET /rentals/my)
2. Click en "Try it out"
3. Click en "Execute"
4. Deberías recibir una respuesta exitosa (200)

## Comparación: Swagger UI vs Postman

### En Swagger UI:
- **Campo "Value"**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Debes incluir "Bearer " seguido de espacio y el token

### En Postman:
- **Header "Authorization"**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- En Postman también incluyes "Bearer " seguido de espacio y el token

**Ambos usan el mismo formato**

## Verificar que el Token es Válido

Si el problema persiste, verifica:

### 1. El token no ha expirado
Los tokens JWT tienen un tiempo de vida limitado (usualmente 24 horas). Si tu sesión es muy antigua, necesitas hacer login nuevamente.

### 2. Variables de entorno correctas
Verifica que tu archivo `.env` tenga:
```env
JWT_SECRET=tu_secreto_aqui
JWT_EXPIRES_IN=24h
```

### 3. El servidor se reinició después de cambios
Si hiciste cambios en la configuración JWT, reinicia el servidor:
```bash
# Detén el servidor (Ctrl+C)
# Luego reinicia
npm run dev
```

## Ejemplo Completo: Login y Uso

### 1. Registro (si no tienes cuenta)
```
POST /auth/register
Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "regionalId": "REG001"
}

Respuesta:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBm..."
  }
}
```

### 2. Preparar Token
Copia el token y agrega "Bearer " al inicio:
`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzBm...`

### 3. Authorize
- Click 🔓 "Authorize"
- Pega `Bearer ` + tu token (con espacio entre "Bearer" y el token)
- Click "Authorize"
- Click "Close"

### 4. Usar Endpoint Autenticado
```
GET /rentals/my
(No necesitas agregar nada más, el token ya está configurado)

Respuesta exitosa:
{
  "success": true,
  "data": [ ... ]
}
```

## Errores Comunes y Soluciones

### Error: "No token provided"
**Causa**: No autorizaste en Swagger UI
**Solución**: Sigue los pasos 1-3 arriba

### Error: "Invalid or expired token"
**Causas posibles**:
1. No incluiste "Bearer " al inicio → Agrega "Bearer " seguido de espacio
2. Pegaste el token con comillas → Quita las comillas
3. No hay espacio entre "Bearer" y el token → Debe ser "Bearer " (con espacio)
4. El token expiró → Haz login nuevamente
5. Copiaste mal el token → Copia todo el token completo

### Error: "Forbidden - Insufficient permissions"
**Causa**: Intentas acceder a un endpoint de Admin siendo usuario normal
**Solución**: Usa una cuenta con rol "admin" o usa endpoints de usuario

## Testing Rápido

Puedes probar que la autenticación funciona usando curl:

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Copia el token de la respuesta

# 2. Usar endpoint autenticado
curl http://localhost:3000/api/rentals/my \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Contacto

Si el problema persiste después de seguir estos pasos:
1. Verifica los logs del servidor para más detalles del error
2. Revisa que MongoDB esté conectado
3. Verifica que el archivo `.env` esté configurado correctamente