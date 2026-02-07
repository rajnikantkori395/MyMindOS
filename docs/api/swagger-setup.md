# Swagger/OpenAPI Setup Guide

Complete guide to Swagger integration in MyMindOS.

## Overview

MyMindOS uses **Swagger/OpenAPI** for interactive API documentation. All endpoints are automatically documented and can be tested directly from the browser.

## Access Swagger UI

Once the application is running:

**URL:** `http://localhost:3000/api/docs`

## Features

- ✅ Interactive API testing
- ✅ Request/response schemas
- ✅ JWT authentication support
- ✅ Try-it-out functionality
- ✅ Export to OpenAPI JSON
- ✅ Organized by tags (modules)

## Configuration

Swagger is configured in `apps/backend/src/main.ts`:

```typescript
const swaggerConfig = new DocumentBuilder()
  .setTitle('MyMindOS API')
  .setDescription('Personal AI Operating System - API Documentation')
  .setVersion('1.0')
  .addBearerAuth(/* JWT config */)
  .addTag('Auth', 'Authentication endpoints')
  // ... more tags
  .build();
```

## Adding Swagger to Your Endpoints

### Basic Setup

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('YourModule')
@Controller('your-module')
export class YourController {
  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Success' })
  async findAll() {}
}
```

### Request Body Documentation

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateDto {
  @ApiProperty({ 
    example: 'example@email.com',
    description: 'Email address',
    required: true 
  })
  @IsEmail()
  email: string;
}
```

### Authentication Documentation

```typescript
@Get('protected')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Protected endpoint' })
async protected() {}
```

### Response Documentation

```typescript
@ApiResponse({ 
  status: 201, 
  description: 'Created successfully',
  type: ResponseDto 
})
```

## Testing Endpoints

### Step 1: Start Application
```bash
pnpm run dev:backend
```

### Step 2: Open Swagger UI
Navigate to: `http://localhost:3000/api/docs`

### Step 3: Test Endpoint
1. Find endpoint in the list
2. Click to expand
3. Click "Try it out"
4. Fill parameters/body
5. Click "Execute"
6. Review response

### Step 4: Authenticate (for protected endpoints)
1. Login via `/api/auth/login` to get token
2. Click "Authorize" button (top right)
3. Enter: `Bearer <your-token>`
4. Click "Authorize"
5. Token persists for all requests

## Exporting API Spec

### Download OpenAPI JSON
1. Open Swagger UI
2. Click "Download" button
3. Save `openapi.json`

### Use with:
- Postman (import OpenAPI)
- Insomnia (import OpenAPI)
- Code generation tools
- API testing frameworks

## Best Practices

### 1. Always Document Endpoints
```typescript
@ApiOperation({ 
  summary: 'Brief description',
  description: 'Detailed description' 
})
```

### 2. Document All Responses
```typescript
@ApiResponse({ status: 200, description: 'Success' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 401, description: 'Unauthorized' })
@ApiResponse({ status: 404, description: 'Not found' })
```

### 3. Use DTOs for Request/Response
```typescript
// ✅ Good
@Post()
async create(@Body() dto: CreateDto) {}

// ❌ Bad
@Post()
async create(@Body() body: any) {}
```

### 4. Add Examples
```typescript
@ApiProperty({ 
  example: 'user@example.com',
  description: 'User email' 
})
```

## Module Organization

Endpoints are organized by tags (modules):
- **Health** - Health check endpoints
- **Auth** - Authentication
- **Users** - User management
- **Files** - File operations
- **Memories** - Memory storage
- **AI Engine** - AI operations
- **Chat** - Chat interface
- **Tasks** - Task management
- **Analytics** - Analytics

## Troubleshooting

### Swagger UI Not Loading
- Check app is running on correct port
- Verify `/api/docs` path matches API prefix
- Check browser console for errors

### Endpoints Not Showing
- Verify `@ApiTags()` decorator on controller
- Check controller is registered in module
- Ensure module is imported in AppModule

### Authentication Not Working
- Verify JWT token format: `Bearer <token>`
- Check token hasn't expired
- Ensure endpoint uses `@ApiBearerAuth('JWT-auth')`

## Next Steps

- Review [Implementation Guide](../modules/IMPLEMENTATION_GUIDE.md)
- Add Swagger decorators to all controllers
- Test all endpoints in Swagger UI
- Export OpenAPI spec for external tools

