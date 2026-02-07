# API Documentation

Complete API documentation for MyMindOS backend.

## Table of Contents
- [Swagger UI](#swagger-ui)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Endpoints by Module](#endpoints-by-module)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Swagger UI

### Access Swagger Documentation

Once the application is running, access the interactive API documentation at:

**URL:** `http://localhost:3000/api/docs`

### Features:
- ✅ Interactive API testing
- ✅ Request/response schemas
- ✅ Authentication support (JWT)
- ✅ Try-it-out functionality
- ✅ Export to OpenAPI/Swagger JSON

### Using Swagger UI

1. **Browse Endpoints:**
   - All endpoints organized by tags
   - Expand to see details

2. **Test Endpoints:**
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - See response

3. **Authentication:**
   - Click "Authorize" button (top right)
   - Enter JWT token: `Bearer <your-token>`
   - Click "Authorize"
   - Token persists for all requests

4. **Export:**
   - Click "Download" to get OpenAPI JSON
   - Use with Postman, Insomnia, etc.

## API Overview

### Base URL
```
http://localhost:3000/api
```

### API Version
Current version: `v1` (implicit)

### Content Type
All requests/responses use `application/json`

## Authentication

### JWT Bearer Token

Most endpoints require authentication using JWT Bearer tokens.

**Header Format:**
```
Authorization: Bearer <access_token>
```

**Getting a Token:**
1. Register/Login via `/api/auth/register` or `/api/auth/login`
2. Receive `accessToken` in response
3. Use token in `Authorization` header

**Token Expiration:**
- Access Token: 15 minutes (default)
- Refresh Token: 7 days (default)

## Endpoints by Module

### Health Check
- `GET /api/health` - Health status

### Authentication (Planned)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users (Planned)
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID (admin)

### Files (Planned)
- `POST /api/files` - Upload file
- `GET /api/files` - List files
- `GET /api/files/:id` - Get file details
- `DELETE /api/files/:id` - Delete file

### Memories (Planned)
- `POST /api/memories` - Create memory
- `GET /api/memories` - List/search memories
- `GET /api/memories/:id` - Get memory details
- `POST /api/memories/search` - Semantic search
- `PATCH /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory

### Chat (Planned)
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions` - List sessions
- `GET /api/chat/sessions/:id` - Get session
- `POST /api/chat/sessions/:id/messages` - Send message
- `GET /api/chat/sessions/:id/stream` - Stream response

### Tasks (Planned)
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List tasks
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/complete` - Mark complete

## Request/Response Examples

### Health Check

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "MyMindOS Backend"
}
```

### Register User (Example - when implemented)

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Error Handling

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/users/me",
  "method": "PATCH"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Rate Limiting

Rate limiting will be implemented in future versions.

## OpenAPI Specification

Download the complete OpenAPI specification:

**JSON:** `http://localhost:3000/api/docs-json`

Use this with:
- Postman (import OpenAPI)
- Insomnia (import OpenAPI)
- Code generation tools
- API testing tools

## Next Steps

- Implement endpoints in each module
- Add Swagger decorators to controllers
- Document request/response DTOs
- Add examples for each endpoint

