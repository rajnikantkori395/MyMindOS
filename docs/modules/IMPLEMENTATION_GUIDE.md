# Module Implementation Guide

Complete guide for implementing modules in MyMindOS with Swagger integration.

## Table of Contents
- [Quick Start](#quick-start)
- [Implementation Steps](#implementation-steps)
- [Swagger Integration](#swagger-integration)
- [Testing Workflow](#testing-workflow)
- [Best Practices](#best-practices)

## Quick Start

### 1. Generate Module Structure
```bash
# Generate controller, service, module
pnpm --filter backend exec nest g controller modules/auth
pnpm --filter backend exec nest g service modules/auth
```

### 2. Create Schema
```typescript
// src/modules/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;
  
  @Prop({ required: true })
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### 3. Create DTOs
```typescript
// src/modules/auth/dto/create-user.dto.ts
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;
}
```

### 4. Implement Service
```typescript
// src/modules/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log('Creating user', 'AuthService', { email: createUserDto.email });
    const user = await this.userModel.create(createUserDto);
    this.logger.log('User created', 'AuthService', { userId: user.id });
    return user;
  }
}
```

### 5. Create Controller with Swagger
```typescript
// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }
}
```

### 6. Configure Module
```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

## Implementation Steps

### Step-by-Step Checklist

1. **Schema Definition**
   - [ ] Create schema file in `schemas/`
   - [ ] Define properties with `@Prop()` decorators
   - [ ] Export schema factory

2. **DTOs Creation**
   - [ ] Create DTO files in `dto/`
   - [ ] Add validation decorators (`@IsEmail`, `@IsString`, etc.)
   - [ ] Add Swagger decorators (`@ApiProperty`)
   - [ ] Create separate DTOs for create/update/response

3. **Service Implementation**
   - [ ] Inject Mongoose model
   - [ ] Inject LoggerService for logging
   - [ ] Implement CRUD methods
   - [ ] Add error handling
   - [ ] Log important operations

4. **Controller Setup**
   - [ ] Add `@ApiTags('ModuleName')` decorator
   - [ ] Add `@ApiOperation()` for each endpoint
   - [ ] Add `@ApiResponse()` for success/error cases
   - [ ] Use `@ApiBearerAuth('JWT-auth')` for protected routes
   - [ ] Add request/response DTOs

5. **Module Configuration**
   - [ ] Import MongooseModule with schema
   - [ ] Register controller and service
   - [ ] Export service if used by other modules

6. **Testing**
   - [ ] Test in Swagger UI
   - [ ] Verify validation works
   - [ ] Test authentication (if applicable)
   - [ ] Check error responses

## Swagger Integration

### Basic Decorators

```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('YourModule')  // Groups endpoints in Swagger
@Controller('your-module')
export class YourController {
  @Get()
  @ApiOperation({ summary: 'Brief description', description: 'Detailed description' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findAll() {}
}
```

### Request Body Documentation

```typescript
export class CreateDto {
  @ApiProperty({ 
    example: 'example@email.com',
    description: 'User email address',
    required: true 
  })
  @IsEmail()
  email: string;
}
```

### Response Documentation

```typescript
@ApiResponse({ 
  status: 201, 
  description: 'Created successfully',
  type: UserResponseDto  // Reference to DTO class
})
```

### Authentication Documentation

```typescript
@Get('protected')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')  // Shows lock icon in Swagger
@ApiOperation({ summary: 'Protected endpoint' })
async protected() {}
```

### Query Parameters

```typescript
import { ApiQuery } from '@nestjs/swagger';

@Get()
@ApiQuery({ name: 'page', required: false, type: Number })
@ApiQuery({ name: 'limit', required: false, type: Number })
async findAll(@Query('page') page?: number) {}
```

## Testing Workflow

### 1. Start Application
```bash
pnpm run dev:backend
```

### 2. Open Swagger UI
Navigate to: `http://localhost:3000/api/docs`

### 3. Test Endpoint
1. Find your endpoint in the list
2. Click to expand
3. Click "Try it out"
4. Fill in parameters/body
5. Click "Execute"
6. Review response

### 4. Test Authentication
1. Login via `/api/auth/login` to get token
2. Click "Authorize" button (top right)
3. Enter: `Bearer <your-token>`
4. Click "Authorize"
5. Test protected endpoints

### 5. Export for Postman
1. Click "Download" in Swagger UI
2. Save OpenAPI JSON
3. Import into Postman/Insomnia

## Best Practices

### 1. Always Use DTOs
```typescript
// ✅ Good
@Post()
async create(@Body() createDto: CreateDto) {}

// ❌ Bad
@Post()
async create(@Body() body: any) {}
```

### 2. Document Everything
```typescript
// ✅ Good
@ApiOperation({ summary: 'Create user', description: 'Creates a new user account' })
@ApiResponse({ status: 201, description: 'User created', type: UserDto })
@ApiResponse({ status: 400, description: 'Validation error' })

// ❌ Bad
@Post()
async create() {}
```

### 3. Use Proper HTTP Methods
- `GET` - Retrieve data
- `POST` - Create new resource
- `PATCH` - Partial update
- `PUT` - Full update
- `DELETE` - Remove resource

### 4. Consistent Error Handling
```typescript
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 404, description: 'Not found' })
@ApiResponse({ status: 500, description: 'Internal server error' })
```

### 5. Log Important Operations
```typescript
async create(dto: CreateDto) {
  this.logger.log('Creating resource', 'ServiceName', { key: dto.key });
  // ... operation
  this.logger.log('Resource created', 'ServiceName', { id: result.id });
}
```

## Module Template

Use this template for new modules:

```typescript
// 1. Schema
@Schema({ timestamps: true })
export class Resource extends Document {
  @Prop({ required: true })
  name: string;
}

// 2. DTOs
export class CreateResourceDto {
  @ApiProperty()
  @IsString()
  name: string;
}

// 3. Service
@Injectable()
export class ResourceService {
  constructor(
    @InjectModel(Resource.name) private model: Model<Resource>,
    private logger: LoggerService,
  ) {}
}

// 4. Controller
@ApiTags('Resources')
@Controller('resources')
export class ResourceController {
  @Post()
  @ApiOperation({ summary: 'Create resource' })
  async create(@Body() dto: CreateResourceDto) {}
}

// 5. Module
@Module({
  imports: [MongooseModule.forFeature([...])],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
```

## Next Steps

1. Review existing module docs for specific implementation details
2. Follow this guide for each module
3. Test all endpoints in Swagger UI
4. Document any custom patterns in module-specific docs

