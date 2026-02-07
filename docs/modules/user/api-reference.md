# User Module API Reference

Complete API reference for the User module endpoints.

## Base URL

```
http://localhost:3000/api/users
```

## Authentication

All endpoints require JWT authentication (when Auth module is implemented).

**Header:**
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Get Current User Profile

Get the authenticated user's profile.

**Endpoint:** `GET /api/users/me`

**Authentication:** Required

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg",
  "locale": "en",
  "timezone": "America/New_York",
  "role": "user",
  "status": "active",
  "preferences": {
    "theme": "dark",
    "notifications": true
  },
  "lastLoginAt": "2024-01-01T00:00:00.000Z",
  "emailVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <your-token>"
```

---

### 2. Update Current User Profile

Update the authenticated user's profile.

**Endpoint:** `PATCH /api/users/me`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Jane Doe",
  "avatar": "https://example.com/new-avatar.jpg",
  "locale": "fr",
  "timezone": "Europe/Paris",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

**All fields are optional.**

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "Jane Doe",
  "avatar": "https://example.com/new-avatar.jpg",
  "locale": "fr",
  "timezone": "Europe/Paris",
  "role": "user",
  "status": "active",
  "preferences": {
    "theme": "light",
    "notifications": false
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

**Status Codes:**
- `200 OK` - Profile updated successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - User not found

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "locale": "fr",
    "preferences": {
      "theme": "light"
    }
  }'
```

---

### 3. Get User by ID

Get a user's profile by ID (admin only).

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required (Admin)

**Path Parameters:**
- `id` (string, required) - User ID

**Response:**
Same as Get Current User Profile

**Status Codes:**
- `200 OK` - User retrieved successfully
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Not an admin
- `404 Not Found` - User not found

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>"
```

---

### 4. Update User Status

Update a user's status (admin only).

**Endpoint:** `PATCH /api/users/:id/status`

**Authentication:** Required (Admin)

**Path Parameters:**
- `id` (string, required) - User ID

**Request Body:**
```json
{
  "status": "suspended"
}
```

**Status Values:**
- `active` - User can access the system
- `inactive` - User account is inactive
- `suspended` - User account is suspended

**Response:**
Updated user object with new status

**Status Codes:**
- `200 OK` - Status updated successfully
- `400 Bad Request` - Invalid status or self-suspension attempt
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Not an admin
- `404 Not Found` - User not found

**cURL Example:**
```bash
curl -X PATCH http://localhost:3000/api/users/507f1f77bcf86cd799439011/status \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "suspended"}'
```

---

### 5. Get All Users

Get paginated list of all users (admin only).

**Endpoint:** `GET /api/users`

**Authentication:** Required (Admin)

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)
- `status` (string, optional) - Filter by status (active/inactive/suspended)

**Response:**
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "status": "active",
      ...
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

**Status Codes:**
- `200 OK` - Users retrieved successfully
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Not an admin

**cURL Examples:**
```bash
# Get first page
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer <admin-token>"

# Filter by status
curl -X GET "http://localhost:3000/api/users?status=active&page=1&limit=20" \
  -H "Authorization: Bearer <admin-token>"
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 404,
  "message": "User with ID 507f1f77bcf86cd799439011 not found",
  "error": "Not Found"
}
```

## Swagger UI

Interactive API documentation and testing available at:

**URL:** `http://localhost:3000/api/docs`

Navigate to **Users** tag to see all endpoints with:
- Request/response schemas
- Try-it-out functionality
- Authentication support
- Example values

## Testing Workflow

1. **Start the application:**
   ```bash
   pnpm run dev:backend
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:3000/api/docs
   ```

3. **Authenticate (when Auth module is ready):**
   - Login via `/api/auth/login`
   - Copy access token
   - Click "Authorize" in Swagger UI
   - Enter: `Bearer <token>`

4. **Test endpoints:**
   - Find endpoint under **Users** tag
   - Click "Try it out"
   - Fill in parameters/body
   - Click "Execute"
   - Review response

