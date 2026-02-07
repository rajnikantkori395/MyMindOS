# User Module Implementation Guide

Step-by-step guide to the User module implementation.

## Implementation Steps

### Step 1: User Schema

**File:** `apps/backend/src/modules/user/schemas/user.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'en' })
  locale: string;

  @Prop()
  timezone?: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ type: Object, default: {} })
  preferences: Record<string, any>;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });
```

**Key Features:**
- Email uniqueness and lowercase normalization
- Role-based access (user/admin)
- Status management (active/inactive/suspended)
- Flexible preferences object
- Automatic timestamps (createdAt, updatedAt)
- Performance indexes

### Step 2: DTOs (Data Transfer Objects)

#### Update Profile DTO

**File:** `apps/backend/src/modules/user/dto/update-profile.dto.ts`

```typescript
import { IsString, IsOptional, IsObject, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({ example: 'en', default: 'en' })
  @IsOptional()
  @IsString()
  locale?: string;

  @ApiPropertyOptional({ example: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: { theme: 'dark' } })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
}
```

#### Update Status DTO

**File:** `apps/backend/src/modules/user/dto/update-status.dto.ts`

```typescript
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../schemas/user.schema';

export class UpdateStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  status: UserStatus;
}
```

#### User Response DTO

**File:** `apps/backend/src/modules/user/dto/user-response.dto.ts`

Used for Swagger documentation to define response structure.

### Step 3: User Service

**File:** `apps/backend/src/modules/user/user.service.ts`

**Key Methods:**

1. **`getProfile(userId: string)`**
   - Retrieves user profile by ID
   - Throws `NotFoundException` if user doesn't exist

2. **`updateProfile(userId: string, updateDto: UpdateProfileDto)`**
   - Updates user profile fields
   - Merges preferences object
   - Logs business event for analytics

3. **`updateStatus(userId: string, updateDto: UpdateStatusDto, requesterId: string)`**
   - Admin-only operation
   - Prevents self-suspension
   - Validates requester is admin

4. **`findAll(page, limit, status?)`**
   - Paginated user list
   - Optional status filter
   - Returns total count for pagination

5. **`updateLastLogin(userId: string)`**
   - Updates last login timestamp
   - Called after successful authentication

**Error Handling:**
- `NotFoundException` - User not found
- `ForbiddenException` - Insufficient permissions
- `BadRequestException` - Invalid operation (e.g., self-suspension)

### Step 4: User Controller

**File:** `apps/backend/src/modules/user/user.controller.ts`

**Endpoints:**

1. **`GET /api/users/me`**
   - Get current user profile
   - Requires authentication

2. **`PATCH /api/users/me`**
   - Update current user profile
   - Validates input with DTOs

3. **`GET /api/users/:id`**
   - Get user by ID
   - Admin only

4. **`PATCH /api/users/:id/status`**
   - Update user status
   - Admin only

5. **`GET /api/users`**
   - Get all users with pagination
   - Admin only
   - Supports status filter

**Swagger Integration:**
- All endpoints documented with `@ApiOperation`
- Response schemas defined with `@ApiResponse`
- Request/response examples provided
- Authentication requirements specified

### Step 5: Module Wiring

**File:** `apps/backend/src/modules/user/user.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export for use in other modules
})
export class UserModule {}
```

**Module Registration:**
Already registered in `apps/backend/src/app.module.ts`

## Implementation Checklist

- [x] Create User schema with Mongoose
- [x] Define enums (UserRole, UserStatus)
- [x] Add database indexes
- [x] Create DTOs with validation
- [x] Add Swagger decorators to DTOs
- [x] Implement UserService methods
- [x] Add error handling
- [x] Integrate LoggerService
- [x] Create UserController endpoints
- [x] Add Swagger documentation
- [x] Wire up UserModule
- [ ] Add authentication guards (pending Auth module)
- [ ] Write unit tests
- [ ] Write integration tests

## Code Patterns Used

### 1. Service Pattern
- Business logic in service layer
- Controllers stay thin
- Reusable service methods

### 2. DTO Pattern
- Input validation with class-validator
- Swagger documentation with decorators
- Type safety with TypeScript

### 3. Error Handling
- Custom exceptions (NotFoundException, ForbiddenException)
- Consistent error responses
- Logging for debugging

### 4. Logging
- Structured logging with LoggerService
- Business events for analytics
- Context-aware log messages

## Next Steps

1. **Implement Auth Module:**
   - Uncomment guards in controller
   - Replace mock userIds

2. **Add Tests:**
   - Unit tests for service
   - Integration tests for endpoints

3. **Enhance Features:**
   - User search/filter
   - Bulk operations
   - Activity tracking

