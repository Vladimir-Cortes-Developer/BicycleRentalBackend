# Documentación de la API con Swagger

## Introducción

Este proyecto incluye documentación completa de la API usando Swagger/OpenAPI 3.0, siguiendo las mejores prácticas de documentación de APIs.

## Acceder a la Documentación

### Interfaz Web de Swagger UI

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api-docs
```

### Especificación OpenAPI en JSON

Para obtener la especificación completa de la API en formato JSON:

```
http://localhost:3000/api-docs.json
```

## Características de la Documentación

### 1. **Documentación Completa de Endpoints**

Todos los endpoints están documentados con:
- Descripción clara del propósito
- Parámetros de entrada (path, query, body)
- Esquemas de respuesta con ejemplos
- Códigos de estado HTTP
- Requisitos de autenticación
- Tipos de contenido

### 2. **Organización por Tags**

Los endpoints están organizados en las siguientes categorías:
- **Authentication**: Registro, login y gestión de usuarios
- **Bicycles**: Gestión de bicicletas
- **Rentals**: Operaciones de alquiler
- **Events**: Gestión de eventos
- **Maintenance**: Logs de mantenimiento
- **Reports**: Reportes y estadísticas
- **Health**: Estado del servidor

### 3. **Esquemas Reutilizables**

Se definen esquemas reutilizables para:
- User
- Bicycle
- Rental
- Event
- MaintenanceLog
- Error
- ValidationError

### 4. **Seguridad**

La documentación incluye:
- Esquema de autenticación Bearer JWT
- Indicación clara de endpoints públicos vs privados
- Permisos requeridos (Admin, User)

### 5. **Respuestas de Error Estandarizadas**

Respuestas de error consistentes:
- 400: ValidationError
- 401: UnauthorizedError
- 403: ForbiddenError
- 404: NotFoundError
- 500: ServerError

## Usar Swagger UI

### Probar Endpoints

1. **Endpoints Públicos**: Puedes probarlos directamente haciendo click en "Try it out"

2. **Endpoints Autenticados**:
   - Primero, usa el endpoint `/auth/login` o `/auth/register`
   - Copia el token JWT de la respuesta
   - Click en el botón "Authorize" (candado) en la parte superior
   - Pega el token en el campo "Value"
   - Click en "Authorize"
   - Ahora puedes probar endpoints protegidos

### Ejemplos de Uso

#### 1. Registrar un Usuario
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "regionalId": "REG001"
}
```

#### 2. Obtener Bicicletas Disponibles
```bash
GET /api/bicycles/available?type=mountain
```

#### 3. Alquilar una Bicicleta
```bash
POST /api/rentals
Headers: Authorization: Bearer {token}
{
  "bicycleId": "507f1f77bcf86cd799439011"
}
```

## Exportar la Documentación

### Formato JSON
```bash
curl http://localhost:3000/api-docs.json > openapi.json
```

### Formato YAML (usando herramientas)
```bash
npm install -g swagger2openapi
curl http://localhost:3000/api-docs.json | swagger2openapi > openapi.yaml
```

## Integración con Otras Herramientas

### Postman
1. Importa la especificación desde `http://localhost:3000/api-docs.json`
2. Postman creará automáticamente una colección con todos los endpoints

### Insomnia
1. Import > From URL
2. Usa `http://localhost:3000/api-docs.json`

### Generación de Clientes
Puedes generar clientes automáticamente usando Swagger Codegen:

```bash
# Cliente JavaScript/TypeScript
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api-docs.json \
  -g typescript-axios \
  -o ./client

# Cliente Python
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api-docs.json \
  -g python \
  -o ./client-python
```

## Estructura de Archivos

```
src/
├── config/
│   └── swagger.ts          # Configuración de Swagger
├── routes/
│   ├── auth.routes.ts      # Endpoints de autenticación (documentados)
│   ├── bicycle.routes.ts   # Endpoints de bicicletas (documentados)
│   ├── rental.routes.ts    # Endpoints de alquileres (documentados)
│   ├── event.routes.ts     # Endpoints de eventos (documentados)
│   ├── maintenance.routes.ts # Endpoints de mantenimiento (documentados)
│   ├── report.routes.ts    # Endpoints de reportes (documentados)
│   └── index.ts            # Health check (documentado)
└── app.ts                  # Configuración de Swagger UI
```

## Mejores Prácticas Implementadas

### 1. **Versionamiento**
- Versión de la API claramente especificada
- Información de contacto y licencia

### 2. **Ejemplos Realistas**
- Todos los campos tienen ejemplos de valores
- IDs de MongoDB en formato correcto
- Fechas en formato ISO 8601

### 3. **Validación Clara**
- Campos requeridos vs opcionales
- Tipos de datos específicos
- Enumeraciones para valores limitados
- Rangos y límites de longitud

### 4. **Respuestas Detalladas**
- Códigos de estado apropiados
- Mensajes de error descriptivos
- Estructura consistente de respuestas

### 5. **Seguridad**
- Autenticación JWT documentada
- Roles y permisos claramente indicados
- Content Security Policy configurada

## Mantenimiento

### Actualizar la Documentación

Cuando agregues o modifiques endpoints:

1. Agrega las anotaciones Swagger en el archivo de rutas:
```typescript
/**
 * @swagger
 * /ruta/ejemplo:
 *   get:
 *     summary: Descripción del endpoint
 *     tags: [Tag]
 *     ...
 */
```

2. Si necesitas nuevos esquemas, agrégalos en `src/config/swagger.ts`

3. La documentación se actualiza automáticamente al reiniciar el servidor

### Validar la Especificación

```bash
# Usando swagger-cli
npm install -g @apidevtools/swagger-cli
swagger-cli validate http://localhost:3000/api-docs.json
```

## Recursos Adicionales

- [OpenAPI Specification 3.0](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/docs/open-source-tools/swagger-ui/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)

## Soporte

Para preguntas o problemas con la documentación:
- GitHub Issues: https://github.com/Vladimir-Cortes-Developer/BicycleRentalBackend/issues
- Email: support@bicyclerental.com