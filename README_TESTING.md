# Guía de Pruebas - SENA Bicycle Rental API

## Iniciar el Servidor

### 1. Compilar el proyecto
```bash
npm run build
```

### 2. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```

### 3. Iniciar el servidor en modo producción
```bash
npm start
```

## URL del API
```
http://localhost:3000/api
```

## Endpoints Disponibles

### 📋 Health Check
- `GET /api/health` - Verificar estado del servidor

### 🔐 Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Perfil del usuario (auth)

### 🚲 Bicicletas
- `POST /api/bicycles` - Crear bicicleta (admin)
- `GET /api/bicycles` - Listar bicicletas
- `GET /api/bicycles/available` - Bicicletas disponibles
- `GET /api/bicycles/nearby` - Bicicletas cercanas
- `GET /api/bicycles/code/:code` - Por código
- `GET /api/bicycles/:id` - Por ID
- `PUT /api/bicycles/:id` - Actualizar (admin)
- `PATCH /api/bicycles/:id/status` - Actualizar estado (admin)
- `PATCH /api/bicycles/:id/location` - Actualizar ubicación (admin)
- `DELETE /api/bicycles/:id` - Eliminar (admin)
- `GET /api/bicycles/stats/count-by-status` - Estadísticas (admin)

### 🎫 Alquileres
- `POST /api/rentals` - Alquilar bicicleta (auth)
- `PUT /api/rentals/:id/return` - Devolver bicicleta (auth)
- `GET /api/rentals/my/active` - Mi alquiler activo (auth)
- `GET /api/rentals/my` - Mis alquileres (auth)
- `GET /api/rentals/:id` - Por ID (auth)
- `GET /api/rentals` - Todos (admin)
- `DELETE /api/rentals/:id` - Cancelar (auth)

### 🎉 Eventos (Ciclopaseos)
- `POST /api/events` - Crear evento (admin)
- `PUT /api/events/:id` - Actualizar (admin)
- `DELETE /api/events/:id` - Eliminar (admin)
- `GET /api/events` - Listar todos
- `GET /api/events/upcoming` - Próximos eventos
- `GET /api/events/:id` - Por ID
- `POST /api/events/:id/register` - Registrarse (auth)
- `DELETE /api/events/:id/register` - Cancelar registro (auth)
- `GET /api/events/my` - Mis eventos (auth)
- `GET /api/events/:id/participants` - Participantes (admin)
- `POST /api/events/:id/attendance/:userId` - Marcar asistencia (admin)

### 🔧 Mantenimiento
- `POST /api/maintenance` - Crear registro (admin)
- `PUT /api/maintenance/:id` - Actualizar (admin)
- `DELETE /api/maintenance/:id` - Eliminar (admin)
- `GET /api/maintenance` - Listar todos (admin)
- `GET /api/maintenance/bicycle/:bicycleId` - Por bicicleta (admin)
- `GET /api/maintenance/upcoming` - Próximos (admin)
- `GET /api/maintenance/overdue` - Vencidos (admin)
- `GET /api/maintenance/stats` - Estadísticas (admin)
- `POST /api/maintenance/:id/complete` - Completar (admin)

### 📊 Reportes (Admin)
- `GET /api/reports/revenue/monthly` - Ingresos mensuales
- `GET /api/reports/revenue/range` - Ingresos por rango
- `GET /api/reports/revenue/regional` - Por regional
- `GET /api/reports/bicycles/most-rented` - Más rentadas
- `GET /api/reports/dashboard` - Dashboard
- `GET /api/reports/users/stratum` - Por estrato
- `GET /api/reports/discounts` - Descuentos

## Flujo de Prueba Rápido

### 1. Verificar Servidor
```bash
curl http://localhost:3000/api/health
```

### 2. Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "documentType": "CC",
    "documentNumber": "1234567890",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "Password123",
    "socioeconomicStratum": 3
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

Guarda el token de la respuesta en una variable:
```bash
TOKEN="tu_token_aqui"
```

### 4. Ver Perfil
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Ver Bicicletas Disponibles
```bash
curl http://localhost:3000/api/bicycles/available
```

## Datos de Prueba

### Usuario Normal
```json
{
  "email": "usuario@sena.edu.co",
  "password": "user123"
}
```

### Usuario Admin
```json
{
  "email": "admin@sena.edu.co",
  "password": "admin123"
}
```

## Estructura de Respuestas

### Éxito
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* datos */ }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message"
}
```

## Validaciones DTOs

### RegisterUserDto
- documentType: 'CC' | 'TI' | 'CE'
- documentNumber: string (6-20 caracteres)
- firstName: string (max 100)
- lastName: string (max 100)
- email: email válido
- password: min 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
- phone: opcional (7-15 caracteres)
- socioeconomicStratum: opcional (1-6)

### CreateBicycleDto
- code: string único (max 20)
- brand: string (max 100)
- bicycleModel: string opcional (max 100)
- bicycleType: 'mountain' | 'road' | 'hybrid' | 'electric'
- status: opcional - 'available' | 'rented' | 'maintenance' | 'retired'
- rentalPricePerHour: number positivo
- regionalId: ObjectId válido
- currentLocation: opcional - GeoJSON Point
- description: opcional (max 500)

### RentBicycleDto
- bicycleId: ObjectId válido
- startLocation: opcional - GeoJSON Point

### ReturnBicycleDto
- endLocation: opcional - GeoJSON Point

## Códigos de Estado HTTP

- **200** - OK (operación exitosa)
- **201** - Created (recurso creado)
- **400** - Bad Request (error de validación)
- **401** - Unauthorized (no autenticado)
- **403** - Forbidden (sin permisos)
- **404** - Not Found (recurso no encontrado)
- **409** - Conflict (conflicto, ej: código duplicado)
- **500** - Internal Server Error

## Troubleshooting

### Error: Cannot connect to MongoDB
Verifica que:
- MongoDB Atlas esté configurado correctamente
- La IP esté en la whitelist
- Las credenciales en .env sean correctas

### Error: Invalid token
- El token puede haber expirado (24h)
- Haz login nuevamente para obtener un nuevo token

### Error: Insufficient permissions
- Algunos endpoints requieren role='admin'
- El usuario normal solo tiene acceso limitado

## Logs del Sistema

El sistema registra eventos importantes:
```
📦 [Event] Rental created
✅ [Event] Rental completed
🎉 [Event] User registered
```

## Próximos Pasos

1. Ver `POSTMAN_COLLECTION.md` para importar la colección completa
2. Ejecutar el seed para crear datos de prueba (cuando esté disponible)
3. Revisar logs en consola para depuración
4. Consultar documentación Swagger (cuando esté disponible)
