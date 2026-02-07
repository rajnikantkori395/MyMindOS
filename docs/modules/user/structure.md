# User Module Structure

Complete overview of the User module file structure and organization.

## Directory Structure

```
apps/backend/src/modules/user/
├── constants/              # Module constants
│   ├── index.ts           # Central export
│   └── user.constants.ts  # User-related constants
├── dto/                    # Data Transfer Objects
│   ├── update-profile.dto.ts
│   ├── update-status.dto.ts
│   └── user-response.dto.ts
├── enums/                  # Enumerations
│   ├── index.ts           # Central export
│   ├── user-role.enum.ts  # UserRole enum
│   └── user-status.enum.ts # UserStatus enum
├── repositories/           # Repository layer (data access)
│   └── user.repository.ts # User repository
├── schemas/                # Mongoose schemas
│   └── user.schema.ts     # User schema definition
├── types/                  # TypeScript types
│   ├── index.ts           # Central export
│   └── user.types.ts      # User-related types
├── user.controller.ts     # REST API controller
├── user.service.ts         # Business logic service
└── user.module.ts          # NestJS module definition
```

## Layer Architecture

### 1. Constants Layer (`constants/`)

**Purpose:** Centralized constants for the module

**Files:**
- `user.constants.ts` - Default values, pagination, field names

**Usage:**
```typescript
import { DEFAULT_LOCALE, PAGINATION_DEFAULTS } from './constants';
```

### 2. Enums Layer (`enums/`)

**Purpose:** Type-safe enumerations

**Files:**
- `user-role.enum.ts` - UserRole enum with helper functions
- `user-status.enum.ts` - UserStatus enum with helper functions
- `index.ts` - Central export

**Usage:**
```typescript
import { UserRole, UserStatus, isAdminRole } from './enums';
```

### 3. Types Layer (`types/`)

**Purpose:** TypeScript type definitions

**Files:**
- `user.types.ts` - Interfaces for User, inputs, filters, pagination
- `index.ts` - Central export

**Usage:**
```typescript
import { IUser, CreateUserInput, UpdateUserInput } from './types';
```

### 4. Schema Layer (`schemas/`)

**Purpose:** Mongoose schema definitions

**Files:**
- `user.schema.ts` - User document schema

**Usage:**
```typescript
import { User, UserSchema } from './schemas/user.schema';
```

### 5. Repository Layer (`repositories/`)

**Purpose:** Data access abstraction

**Files:**
- `user.repository.ts` - All database operations

**Methods:**
- `create()` - Create new user
- `findById()` - Find by ID
- `findByEmail()` - Find by email
- `updateById()` - Update by ID
- `updateByEmail()` - Update by email
- `deleteById()` - Soft delete
- `findMany()` - Paginated list with filters
- `count()` - Count users
- `existsByEmail()` - Check existence
- `updateLastLogin()` - Update login timestamp
- `updatePreferences()` - Merge preferences

**Usage:**
```typescript
constructor(private userRepository: UserRepository) {}

async getUser(id: string) {
  return this.userRepository.findById(id);
}
```

### 6. Service Layer (`user.service.ts`)

**Purpose:** Business logic

**Responsibilities:**
- Orchestrate repository calls
- Validate business rules
- Handle errors
- Log operations

**Methods:**
- `getProfile()` - Get user profile
- `updateProfile()` - Update profile
- `updateStatus()` - Update status (admin)
- `findAll()` - Get all users (admin)
- `findById()` - Find by ID
- `findByEmail()` - Find by email
- `updateLastLogin()` - Update login

### 7. Controller Layer (`user.controller.ts`)

**Purpose:** HTTP request handling

**Responsibilities:**
- Route requests to services
- Validate input (DTOs)
- Return responses
- Swagger documentation

**Endpoints:**
- `GET /api/users/me` - Get current user
- `PATCH /api/users/me` - Update current user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/status` - Update status
- `GET /api/users` - Get all users

### 8. DTO Layer (`dto/`)

**Purpose:** Request/response validation

**Files:**
- `update-profile.dto.ts` - Profile update validation
- `update-status.dto.ts` - Status update validation
- `user-response.dto.ts` - Response schema for Swagger

## Benefits of This Structure

### 1. Separation of Concerns
- **Repository:** Data access only
- **Service:** Business logic
- **Controller:** HTTP handling
- **Types/Enums/Constants:** Shared definitions

### 2. Maintainability
- Easy to find code
- Clear responsibilities
- Centralized constants/types

### 3. Testability
- Repository can be mocked
- Service logic isolated
- Types provide contracts

### 4. Scalability
- Easy to add new features
- Consistent patterns
- Reusable components

### 5. Type Safety
- Strong typing throughout
- Compile-time checks
- IDE autocomplete

## Import Patterns

### From Other Modules
```typescript
// Import enums
import { UserRole, UserStatus } from '../user/enums';

// Import types
import { IUser, CreateUserInput } from '../user/types';

// Import constants
import { DEFAULT_LOCALE } from '../user/constants';

// Import repository
import { UserRepository } from '../user/repositories/user.repository';
```

### Within Module
```typescript
// Use relative imports
import { UserRole } from './enums';
import { UpdateUserInput } from './types';
import { PAGINATION_DEFAULTS } from './constants';
```

## Best Practices

1. **Always use types** - Don't use `any` unless necessary
2. **Use enums** - For fixed sets of values
3. **Centralize constants** - Don't hardcode values
4. **Repository pattern** - Keep data access separate
5. **Export via index** - Clean imports
6. **Document types** - Add JSDoc comments

## Next Steps

When implementing other modules, follow this same structure:
- Create `constants/`, `enums/`, `types/` folders
- Implement repository layer
- Keep service and controller thin
- Use consistent naming

