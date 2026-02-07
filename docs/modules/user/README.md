# User Module Documentation

Complete documentation for the User module implementation.

## Table of Contents
- [Overview](README.md#overview)
- [Module Structure](structure.md) ⭐ **File organization and architecture**
- [Implementation Details](implementation.md)
- [API Reference](api-reference.md)
- [Schema & DTOs](schema-dtos.md)
- [Testing Guide](testing.md)

## Overview

The User module manages user profiles, preferences, and personalization metadata consumed across the platform.

### Key Features
- ✅ User profile management (CRUD)
- ✅ Preference storage and updates
- ✅ Role-based access control (user/admin)
- ✅ Status management (active/inactive/suspended)
- ✅ Swagger API documentation
- ✅ Comprehensive logging and observability

### Module Structure
```
apps/backend/src/modules/user/
├── constants/          # Constants (defaults, pagination, field names)
├── dto/                # Data Transfer Objects
├── enums/              # Enumerations (UserRole, UserStatus)
├── repositories/       # Repository layer (data access)
├── schemas/            # Mongoose schemas
├── types/              # TypeScript types
├── user.controller.ts  # REST API controller
├── user.service.ts     # Business logic service
└── user.module.ts      # NestJS module
```

**See [Structure Documentation](structure.md) for detailed architecture.**

## Quick Links

- **Implementation Guide:** [implementation.md](implementation.md)
- **API Reference:** [api-reference.md](api-reference.md)
- **Schema & DTOs:** [schema-dtos.md](schema-dtos.md)
- **Testing Guide:** [testing.md](testing.md)
- **Swagger UI:** `http://localhost:3000/api/docs` → **Users** tag

## Key Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/users/me` | Get current user profile | ✅ |
| `PATCH` | `/api/users/me` | Update current user profile | ✅ |
| `GET` | `/api/users/:id` | Get user by ID | ✅ Admin |
| `PATCH` | `/api/users/:id/status` | Update user status | ✅ Admin |
| `GET` | `/api/users` | Get all users (paginated) | ✅ Admin |

## Status

**Current Status:** ✅ **Implemented**

- [x] User schema with Mongoose
- [x] DTOs with validation
- [x] Service layer with business logic
- [x] Controller with Swagger documentation
- [x] Module wiring
- [ ] Authentication guards (pending Auth module)
- [ ] Unit tests
- [ ] Integration tests

## Next Steps

1. **When Auth module is ready:**
   - Uncomment `@UseGuards(JwtAuthGuard)` in controller
   - Uncomment `@ApiBearerAuth('JWT-auth')`
   - Replace mock userIds with `req.user.id`

2. **Add tests:**
   - Unit tests for service methods
   - Integration tests for endpoints
   - E2E tests with Swagger

3. **Enhancements:**
   - Add user preferences validation
   - Implement user search/filter
   - Add user activity tracking

