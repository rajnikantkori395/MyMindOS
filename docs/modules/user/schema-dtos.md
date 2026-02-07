# User Module Schema & DTOs

Complete reference for database schema and data transfer objects.

## Database Schema

### User Schema

**File:** `apps/backend/src/modules/user/schemas/user.schema.ts`

**Collection:** `users`

**Fields:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `email` | string | ✅ | - | User email (unique, lowercase) |
| `name` | string | ✅ | - | User full name |
| `avatar` | string | ❌ | - | Avatar URL |
| `locale` | string | ❌ | `'en'` | Language/locale code |
| `timezone` | string | ❌ | - | Timezone (e.g., 'America/New_York') |
| `role` | enum | ❌ | `'user'` | User role (user/admin) |
| `status` | enum | ❌ | `'active'` | User status (active/inactive/suspended) |
| `preferences` | object | ❌ | `{}` | User preferences (flexible structure) |
| `lastLoginAt` | Date | ❌ | - | Last login timestamp |
| `emailVerified` | boolean | ❌ | `false` | Email verification status |
| `createdAt` | Date | ✅ | auto | Creation timestamp |
| `updatedAt` | Date | ✅ | auto | Last update timestamp |

**Enums:**

#### UserRole
```typescript
enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
```

#### UserStatus
```typescript
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
```

**Indexes:**
- `email` - Unique index for fast lookups
- `status` - Index for filtering by status
- `role` - Index for role-based queries

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg",
  "locale": "en",
  "timezone": "America/New_York",
  "role": "user",
  "status": "active",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  },
  "lastLoginAt": "2024-01-01T12:00:00.000Z",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Data Transfer Objects (DTOs)

### UpdateProfileDto

**File:** `apps/backend/src/modules/user/dto/update-profile.dto.ts`

**Purpose:** Update user profile fields

**Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `name` | string | ❌ | `@IsString()` | User full name |
| `avatar` | string | ❌ | `@IsUrl()` | Avatar URL |
| `locale` | string | ❌ | `@IsString()` | Language code |
| `timezone` | string | ❌ | `@IsString()` | Timezone |
| `preferences` | object | ❌ | `@IsObject()` | User preferences |

**Example:**
```typescript
{
  name: "Jane Doe",
  avatar: "https://example.com/avatar.jpg",
  locale: "fr",
  timezone: "Europe/Paris",
  preferences: {
    theme: "light",
    notifications: false
  }
}
```

**Validation Rules:**
- All fields are optional
- `avatar` must be a valid URL if provided
- `preferences` must be an object if provided

### UpdateStatusDto

**File:** `apps/backend/src/modules/user/dto/update-status.dto.ts`

**Purpose:** Update user status (admin only)

**Fields:**

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `status` | enum | ✅ | `@IsEnum(UserStatus)` | New user status |

**Valid Values:**
- `active`
- `inactive`
- `suspended`

**Example:**
```typescript
{
  status: "suspended"
}
```

### UserResponseDto

**File:** `apps/backend/src/modules/user/dto/user-response.dto.ts`

**Purpose:** Swagger response schema documentation

**Fields:**
Same as User schema fields

**Used for:**
- Swagger API documentation
- Response type definitions
- API contract specification

## Validation

All DTOs use `class-validator` decorators:

- `@IsString()` - Validates string type
- `@IsOptional()` - Makes field optional
- `@IsUrl()` - Validates URL format
- `@IsObject()` - Validates object type
- `@IsEnum()` - Validates enum value

**Validation Errors:**
```json
{
  "statusCode": 400,
  "message": [
    "avatar must be a URL address",
    "status must be one of the following values: active, inactive, suspended"
  ],
  "error": "Bad Request"
}
```

## Type Safety

All DTOs are TypeScript classes with:
- Type annotations
- Validation decorators
- Swagger decorators
- Optional/required field indicators

**Benefits:**
- Compile-time type checking
- Runtime validation
- Auto-generated API documentation
- IDE autocomplete support

## Best Practices

1. **Always validate input:**
   - Use DTOs for all request bodies
   - Add appropriate validators
   - Handle validation errors gracefully

2. **Keep DTOs focused:**
   - One DTO per operation type
   - Separate input/output DTOs
   - Use inheritance for common fields

3. **Document with Swagger:**
   - Add `@ApiProperty` to all fields
   - Provide examples
   - Describe field purposes

4. **Maintain consistency:**
   - Follow naming conventions
   - Use consistent validation rules
   - Keep DTOs in sync with schemas

