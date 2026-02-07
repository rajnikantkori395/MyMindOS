# Auth Module

## Purpose
Provide secure authentication and authorization for all MyMindOS services.

## Responsibilities
- Handle user registration, login, and logout.
- Issue and refresh JWT access/refresh tokens.
- Manage OAuth 2.0 / OpenID Connect provider integrations (planned).
- Enforce role- and scope-based access control across modules.

## Key Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

## API Documentation
View interactive API docs: `http://localhost:3000/api/docs` → **Auth** tag

## Implementation Guide

### Step 1: Create User Schema
```typescript
// src/modules/auth/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop()
  name: string;

  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### Step 2: Create DTOs
```typescript
// src/modules/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;
}
```

### Step 3: Create Auth Service
```typescript
// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private logger: LoggerService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Implementation
  }

  async login(loginDto: LoginDto) {
    // Implementation
  }
}
```

### Step 4: Create Auth Controller
```typescript
// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user' })
  async getMe(@Request() req) {
    return req.user;
  }
}
```

### Step 5: Configure Module
```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.accessSecret'),
        signOptions: { expiresIn: configService.get<string>('jwt.accessTtl') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

## Continuous Usage Steps

### 1. Development Workflow

**Create Endpoint:**
1. Define DTO with validation decorators
2. Add Swagger decorators (`@ApiProperty`, `@ApiOperation`)
3. Implement service method
4. Create controller endpoint
5. Test in Swagger UI: `http://localhost:3000/api/docs`

**Example:**
```typescript
@Post('register')
@ApiOperation({ summary: 'Register user' })
@ApiResponse({ status: 201, type: UserResponseDto })
async register(@Body() dto: RegisterDto) {
  this.logger.log('User registration attempt', 'AuthController', { email: dto.email });
  return this.authService.register(dto);
}
```

### 2. Testing Endpoints

**Using Swagger UI:**
1. Open `http://localhost:3000/api/docs`
2. Find endpoint under **Auth** tag
3. Click "Try it out"
4. Fill request body
5. Click "Execute"
6. Review response

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'
```

### 3. Adding Authentication

**Protect Endpoint:**
```typescript
@Get('protected')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Protected endpoint' })
async protected(@Request() req) {
  return { user: req.user };
}
```

**Test in Swagger:**
1. Login first to get token
2. Click "Authorize" button
3. Enter: `Bearer <your-token>`
4. Test protected endpoint

## Data Models
- **User**: core identity, auth provider metadata, password hash/salt.
- **Session**: refresh tokens, device info, expiry.
- **OAuthProfile** (planned): provider IDs, scopes, consent status.

## Dependencies
- Uses `UserModule` for identity persistence
- Relies on `ConfigModule` for secrets, token expirations
- Integrates with `PassportModule` strategies (JWT, OAuth)

## Background Jobs
- Revocation cleanup for expired refresh tokens (cron)
- Email verification & password reset notifications (queue)

## Security & Privacy
- Password hashing via bcrypt with config-driven salt rounds
- Refresh tokens stored with device fingerprinting
- Rate limiting, CAPTCHA integration (future work)

## Observability
- Audit log entries for login failures, password changes
- Metrics: login success rate, OTP delivery errors, OAuth handoff latency

## Swagger Integration

All endpoints are documented in Swagger UI:
- View at: `http://localhost:3000/api/docs`
- Tag: **Auth**
- Includes request/response schemas
- Interactive testing available

## Next Steps
1. Implement User schema and DTOs
2. Create AuthService with register/login methods
3. Add JWT strategy and guards
4. Create AuthController with Swagger decorators
5. Test endpoints in Swagger UI
