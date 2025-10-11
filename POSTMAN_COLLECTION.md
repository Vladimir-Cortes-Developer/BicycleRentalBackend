# SENA Bicycle Rental API - Postman Collection

## Configuración Inicial

### Variables de Entorno
Crea un entorno en Postman con estas variables:

```
base_url: http://localhost:3000
api_url: {{base_url}}/api
token: (se llenará automáticamente después del login)
```

## 1. Health Check

### GET Health Check
```
GET {{api_url}}/health
```

## 2. Autenticación (Auth)

### POST Registrar Usuario
```
POST {{api_url}}/auth/register
Content-Type: application/json

{
  "documentType": "CC",
  "documentNumber": "1234567890",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "Password123",
  "phone": "3001234567",
  "socioeconomicStratum": 3
}
```

### POST Login
```
POST {{api_url}}/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Tests (agregar en Postman):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

### GET Mi Perfil
```
GET {{api_url}}/auth/me
Authorization: Bearer {{token}}
```

## 3. Bicicletas (Bicycles)

### POST Crear Bicicleta (Admin)
```
POST {{api_url}}/bicycles
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "code": "BIC001",
  "brand": "Trek",
  "bicycleModel": "FX 3",
  "bicycleType": "hybrid",
  "status": "available",
  "rentalPricePerHour": 5000,
  "regionalId": "{{regionalId}}",
  "currentLocation": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  },
  "description": "Bicicleta híbrida en excelente estado"
}
```

### GET Obtener Todas las Bicicletas
```
GET {{api_url}}/bicycles
```

### GET Bicicletas Disponibles
```
GET {{api_url}}/bicycles/available
```

### GET Bicicletas Cercanas
```
GET {{api_url}}/bicycles/nearby?longitude=-74.0721&latitude=4.7110&maxDistance=5000
```

### GET Bicicleta por Código
```
GET {{api_url}}/bicycles/code/BIC001
```

### GET Bicicleta por ID
```
GET {{api_url}}/bicycles/{{bicycleId}}
```

### PUT Actualizar Bicicleta (Admin)
```
PUT {{api_url}}/bicycles/{{bicycleId}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "rentalPricePerHour": 6000,
  "description": "Bicicleta híbrida actualizada"
}
```

### PATCH Actualizar Estado (Admin)
```
PATCH {{api_url}}/bicycles/{{bicycleId}}/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "maintenance"
}
```

### PATCH Actualizar Ubicación (Admin)
```
PATCH {{api_url}}/bicycles/{{bicycleId}}/location
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "longitude": -74.0721,
  "latitude": 4.7110
}
```

### DELETE Eliminar Bicicleta (Admin)
```
DELETE {{api_url}}/bicycles/{{bicycleId}}
Authorization: Bearer {{token}}
```

### GET Estadísticas por Estado
```
GET {{api_url}}/bicycles/stats/count-by-status
Authorization: Bearer {{token}}
```

## 4. Alquileres (Rentals)

### POST Alquilar Bicicleta
```
POST {{api_url}}/rentals
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "bicycleId": "{{bicycleId}}",
  "startLocation": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  }
}
```

### PUT Devolver Bicicleta
```
PUT {{api_url}}/rentals/{{rentalId}}/return
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "endLocation": {
    "type": "Point",
    "coordinates": [-74.0800, 4.7200]
  }
}
```

### GET Mi Alquiler Activo
```
GET {{api_url}}/rentals/my/active
Authorization: Bearer {{token}}
```

### GET Mis Alquileres
```
GET {{api_url}}/rentals/my
Authorization: Bearer {{token}}
```

### GET Alquiler por ID
```
GET {{api_url}}/rentals/{{rentalId}}
Authorization: Bearer {{token}}
```

### GET Todos los Alquileres (Admin)
```
GET {{api_url}}/rentals
Authorization: Bearer {{token}}
```

### DELETE Cancelar Alquiler
```
DELETE {{api_url}}/rentals/{{rentalId}}
Authorization: Bearer {{token}}
```

## 5. Eventos (Events)

### POST Crear Evento (Admin)
```
POST {{api_url}}/events
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "eventName": "Ciclopaseo Dominical",
  "description": "Recorrido por la ciudad",
  "eventDate": "2025-11-15T08:00:00.000Z",
  "startLocation": {
    "type": "Point",
    "coordinates": [-74.0721, 4.7110]
  },
  "distance": 15,
  "maxParticipants": 50,
  "regionalId": "{{regionalId}}"
}
```

### PUT Actualizar Evento (Admin)
```
PUT {{api_url}}/events/{{eventId}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "maxParticipants": 60
}
```

### GET Eventos Próximos
```
GET {{api_url}}/events/upcoming
```

### GET Todos los Eventos
```
GET {{api_url}}/events
```

### GET Evento por ID
```
GET {{api_url}}/events/{{eventId}}
```

### POST Registrarse a Evento
```
POST {{api_url}}/events/{{eventId}}/register
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "eventId": "{{eventId}}"
}
```

### DELETE Cancelar Registro
```
DELETE {{api_url}}/events/{{eventId}}/register
Authorization: Bearer {{token}}
```

### GET Mis Eventos
```
GET {{api_url}}/events/my
Authorization: Bearer {{token}}
```

### GET Participantes (Admin)
```
GET {{api_url}}/events/{{eventId}}/participants
Authorization: Bearer {{token}}
```

### POST Marcar Asistencia (Admin)
```
POST {{api_url}}/events/{{eventId}}/attendance/{{userId}}
Authorization: Bearer {{token}}
```

### DELETE Eliminar Evento (Admin)
```
DELETE {{api_url}}/events/{{eventId}}
Authorization: Bearer {{token}}
```

## 6. Mantenimiento (Maintenance)

### POST Crear Registro de Mantenimiento (Admin)
```
POST {{api_url}}/maintenance
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "bicycleId": "{{bicycleId}}",
  "maintenanceType": "preventive",
  "description": "Revisión general",
  "cost": 50000,
  "performedBy": "Taller Central",
  "nextMaintenanceDate": "2025-12-15T00:00:00.000Z"
}
```

### PUT Actualizar Registro (Admin)
```
PUT {{api_url}}/maintenance/{{maintenanceId}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "cost": 60000
}
```

### GET Todos los Registros (Admin)
```
GET {{api_url}}/maintenance
Authorization: Bearer {{token}}
```

### GET Por Bicicleta (Admin)
```
GET {{api_url}}/maintenance/bicycle/{{bicycleId}}
Authorization: Bearer {{token}}
```

### GET Próximos Mantenimientos (Admin)
```
GET {{api_url}}/maintenance/upcoming
Authorization: Bearer {{token}}
```

### GET Mantenimientos Vencidos (Admin)
```
GET {{api_url}}/maintenance/overdue
Authorization: Bearer {{token}}
```

### GET Estadísticas (Admin)
```
GET {{api_url}}/maintenance/stats
Authorization: Bearer {{token}}
```

### POST Completar Mantenimiento (Admin)
```
POST {{api_url}}/maintenance/{{maintenanceId}}/complete
Authorization: Bearer {{token}}
```

### DELETE Eliminar Registro (Admin)
```
DELETE {{api_url}}/maintenance/{{maintenanceId}}
Authorization: Bearer {{token}}
```

## 7. Reportes (Reports) - Todos Admin

### GET Ingresos Mensuales
```
GET {{api_url}}/reports/revenue/monthly?year=2025
Authorization: Bearer {{token}}
```

### GET Ingresos por Rango
```
GET {{api_url}}/reports/revenue/range?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {{token}}
```

### GET Ingresos por Regional
```
GET {{api_url}}/reports/revenue/regional?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {{token}}
```

### GET Bicicletas Más Rentadas
```
GET {{api_url}}/reports/bicycles/most-rented?limit=10
Authorization: Bearer {{token}}
```

### GET Dashboard
```
GET {{api_url}}/reports/dashboard
Authorization: Bearer {{token}}
```

### GET Usuarios por Estrato
```
GET {{api_url}}/reports/users/stratum
Authorization: Bearer {{token}}
```

### GET Reporte de Descuentos
```
GET {{api_url}}/reports/discounts?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {{token}}
```

---

## Orden de Prueba Recomendado

1. **Health Check** - Verificar que el servidor esté corriendo
2. **Registrar Usuario** - Crear cuenta de usuario normal
3. **Login** - Obtener token JWT (se guardará automáticamente)
4. **Mi Perfil** - Verificar autenticación
5. **Crear Bicicleta** (necesitas admin) - Crear bicicletas para pruebas
6. **Listar Bicicletas** - Ver las bicicletas disponibles
7. **Alquilar Bicicleta** - Hacer un alquiler
8. **Mi Alquiler Activo** - Ver el alquiler en curso
9. **Devolver Bicicleta** - Completar el alquiler
10. **Crear Evento** (admin) - Crear un ciclopaseo
11. **Registrarse a Evento** - Inscribirse al evento
12. **Dashboard** (admin) - Ver estadísticas generales

## Notas Importantes

- Los endpoints marcados con **(Admin)** requieren que el usuario tenga role='admin'
- Todos los endpoints que requieren autenticación usan el header: `Authorization: Bearer {{token}}`
- Las fechas deben estar en formato ISO 8601
- Las coordenadas GeoJSON usan el formato [longitud, latitud]
- El token JWT expira en 24 horas (configurable)

## Scripts de Postman Útiles

### Guardar Token Automáticamente
Agregar en la pestaña "Tests" del endpoint de login:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    console.log("Token guardado:", response.data.token);
}
```

### Guardar IDs para Pruebas
```javascript
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("bicycleId", response.data._id);
    // o rentalId, eventId, etc.
}
```
