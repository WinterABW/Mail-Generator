# Temporary Email API

API REST para generar emails temporales usando Guerrilla Mail. Permite crear, gestionar y eliminar emails temporales con autenticación JWT.

## Características

- ✅ Autenticación JWT (register/login)
- ✅ Múltiples dominios disponibles (11 dominios)
- ✅ Crear emails temporales con dominio personalizado
- ✅ Recibir y leer mensajes
- ✅ Eliminar emails (borrar sesión)
- ✅ Rate limiting
- ✅ Logging con Winston
- ✅ TypeScript
- ✅ Código limpio y mantenible

## Requisitos

- [Bun](https://bun.sh/) >= 1.0.0

## Instalación

```bash
cd backend
bun install
```

## Configuración

Copia el archivo `.env.example` a `.env` y configura las variables:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu-secret-key-aqui
JWT_EXPIRES_IN=24h

# Guerrilla Mail
GUERRILLA_DEFAULT_DOMAIN=guerrillamail.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## Desarrollo

```bash
bun run dev
```

El servidor estará disponible en `http://localhost:3000`

## Producción

```bash
# Build
bun run build

# Start
bun run start
```

## Docker

```bash
docker build -t temp-mail-api backend/
docker run -p 3000:3000 temp-mail-api
```

## API Endpoints

### Autenticación (públicas)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Iniciar sesión |

### Emails (requieren autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/emails` | Crear email temporal |
| `GET` | `/api/emails` | Listar mis emails |
| `GET` | `/api/emails/domains` | Ver dominios disponibles |
| `GET` | `/api/emails/:id/messages` | Obtener mensajes |
| `GET` | `/api/emails/:id/messages/:msgId` | Ver mensaje específico |
| `DELETE` | `/api/emails/:id` | Eliminar email |

### Utilidades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check |

## Ejemplos de Uso

### 1. Registrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid...",
      "username": "testuser"
    }
  },
  "message": "User registered successfully"
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### 3. Crear email temporal

```bash
curl -X POST http://localhost:3000/api/emails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"domain": "sharklasers.com"}'
```

O sin especificar dominio (usará el por defecto):
```bash
curl -X POST http://localhost:3000/api/emails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN"
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "id": "uuid...",
    "email": "abc123@sharklasers.com",
    "username": "abc123",
    "domain": "sharklasers.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-01T01:00:00.000Z"
  },
  "message": "Email created successfully"
}
```

### 4. Listar dominios disponibles

```bash
curl -X GET http://localhost:3000/api/emails/domains \
  -H "Authorization: Bearer TU_TOKEN"
```

### 5. Obtener mensajes

```bash
curl -X GET http://localhost:3000/api/emails/EMAIL_ID/messages \
  -H "Authorization: Bearer TU_TOKEN"
```

### 6. Eliminar email

```bash
curl -X DELETE http://localhost:3000/api/emails/EMAIL_ID \
  -H "Authorization: Bearer TU_TOKEN"
```

## Dominios Disponibles

| Dominio |
|---------|
| guerrillamail.com |
| sharklasers.com |
| guerrillamail.info |
| grr.la |
| guerrillamail.biz |
| guerrillamail.de |
| guerrillamail.net |
| guerrillamail.org |
| guerrillamailblock.com |
| pokemail.net |
| spam4.me |

## Despliegue en Render

1. Sube el código a GitHub
2. Crea un nuevo Web Service en Render
3. Conecta tu repositorio
4. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `bun install && bun run build`
   - **Start Command**: `bun run start`
5. Añade las variables de entorno en Render dashboard

## Licencia

MIT
