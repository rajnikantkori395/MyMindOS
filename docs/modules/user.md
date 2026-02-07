# User Module

## Purpose
Manage user profiles, preferences, and personalization metadata consumed across the platform.

## Status
✅ **Implemented** - See [detailed documentation](user/README.md)

## Quick Links
- **[Implementation Guide](user/implementation.md)** - Step-by-step implementation details
- **[API Reference](user/api-reference.md)** - Complete API documentation
- **[Schema & DTOs](user/schema-dtos.md)** - Database schema and data transfer objects
- **[Testing Guide](user/testing.md)** - Testing strategies and examples
- **[Swagger UI](http://localhost:3000/api/docs)** - Interactive API testing

## Responsibilities
- CRUD operations for profile fields and notification settings.
- Store personalization signals (preferred AI tone, focus areas).
- Provide read models for frontend dashboards and AI pipelines.

## Key Endpoints
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update current user profile
- `GET /api/users/:id` - Get user by ID (admin only)
- `PATCH /api/users/:id/status` - Update user status (admin only)
- `GET /api/users` - Get all users with pagination (admin only)

## API Documentation
View interactive API docs: `http://localhost:3000/api/docs` → **Users** tag

## Implementation Guide

### Step 1: Create User Profile Schema
```typescript
// src/modules/user/schemas/user-profile.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserProfile extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop()
  name: string;

  @Prop()
  avatar: string;

  @Prop({ default: 'en' })
  locale: string;

  @Prop()
  timezone: string;

  @Prop({ type: Object, default: {} })
  preferences: Record<string, any>;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
```

### Step 2: Create DTOs
```typescript
// src/modules/user/dto/update-profile.dto.ts
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  locale?: string;
}
```

### Step 3: Implement Service
```typescript
// src/modules/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile } from './schemas/user-profile.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserProfile.name) private profileModel: Model<UserProfile>,
    private logger: LoggerService,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.profileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    this.logger.log('Updating user profile', 'UserService', { userId });
    const profile = await this.profileModel.findOneAndUpdate(
      { userId },
      updateDto,
      { new: true, upsert: true },
    );
    this.logger.business('profile_updated', { userId, fields: Object.keys(updateDto) });
    return profile;
  }
}
```

### Step 4: Create Controller with Swagger
```typescript
// src/modules/user/user.controller.ts
import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  async getMe(@Request() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateMe(@Request() req, @Body() updateDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.id, updateDto);
  }
}
```

## Continuous Usage Steps

### 1. Development Workflow

**Add New Endpoint:**
1. Create/update DTO with validation
2. Add Swagger decorators
3. Implement service method
4. Add controller endpoint
5. Test in Swagger UI

**Example:**
```typescript
@Get('me/preferences')
@ApiOperation({ summary: 'Get user preferences' })
@ApiResponse({ status: 200, type: PreferencesDto })
async getPreferences(@Request() req) {
  return this.userService.getPreferences(req.user.id);
}
```

### 2. Testing in Swagger

1. **Authenticate First:**
   - Login via `/api/auth/login`
   - Copy access token

2. **Authorize:**
   - Click "Authorize" in Swagger UI
   - Enter: `Bearer <token>`
   - Click "Authorize"

3. **Test Endpoint:**
   - Find endpoint under **Users** tag
   - Click "Try it out"
   - Execute request
   - Review response

### 3. Using cURL

```bash
# Get profile
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <your-token>"

# Update profile
curl -X PATCH http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name","locale":"fr"}'
```

## Data Models
- **UserProfile**: name, avatar, locale, timezone, roles
- **Preference**: toggle-based config (emails, reminders, privacy choices)
- **WorkspaceSettings** (future team mode)

## Dependencies
- Consumes `AuthModule` guards to secure routes
- Emits events to `AnalyticsModule` on profile updates
- Shares DTOs with frontend via `libs/shared`

## Background Jobs
- Periodic sync with third-party integrations (e.g., calendar) when enabled

## Security & Privacy
- Enforce row-level access so users only read/update their own records
- Sensitive fields (emails, phone numbers) encrypted at rest in future phase

## Observability
- Metrics: profile completion rate, preference adoption
- Events feed into analytics dashboards for personalization impact

## Swagger Integration

All endpoints documented with:
- Request/response schemas
- Authentication requirements
- Example values
- Error responses

View at: `http://localhost:3000/api/docs` → **Users** tag

## Next Steps
1. Implement UserProfile schema
2. Create DTOs for profile operations
3. Implement UserService methods
4. Create UserController with Swagger decorators
5. Test endpoints in Swagger UI
