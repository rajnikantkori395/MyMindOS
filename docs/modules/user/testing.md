# User Module Testing Guide

Complete guide for testing the User module.

## Testing Strategy

### Unit Tests
- Test service methods in isolation
- Mock database operations
- Test error handling
- Verify business logic

### Integration Tests
- Test API endpoints
- Test database interactions
- Test authentication/authorization
- Test validation

### E2E Tests
- Test complete user flows
- Test with Swagger UI
- Test error scenarios

## Unit Testing

### Setup

**File:** `apps/backend/src/modules/user/user.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { LoggerService } from '../../common/logger/logger.service';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            business: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockUser = {
        id: userId,
        email: 'user@example.com',
        name: 'John Doe',
      };

      jest.spyOn(model, 'findById').mockResolvedValue(mockUser as any);

      const result = await service.getProfile(userId);

      expect(result).toEqual(mockUser);
      expect(model.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.getProfile('invalid-id')).rejects.toThrow(
        'User with ID invalid-id not found',
      );
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateDto = { name: 'Jane Doe', locale: 'fr' };
      const mockUser = {
        id: userId,
        email: 'user@example.com',
        name: 'Jane Doe',
        locale: 'fr',
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(service, 'findById').mockResolvedValue(mockUser as any);

      const result = await service.updateProfile(userId, updateDto);

      expect(result.name).toBe('Jane Doe');
      expect(result.locale).toBe('fr');
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
```

### Running Unit Tests

```bash
# Run all tests
pnpm --filter backend test

# Run user module tests only
pnpm --filter backend test user

# Watch mode
pnpm --filter backend test:watch user
```

## Integration Testing

### Setup

**File:** `apps/backend/test/user.e2e-spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users/me (GET)', () => {
    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/users/me')
        .expect(401);
    });

    // Add more tests when Auth module is ready
  });
});
```

### Running Integration Tests

```bash
# Run e2e tests
pnpm --filter backend test:e2e

# Run specific test file
pnpm --filter backend test:e2e user.e2e-spec
```

## Testing with Swagger UI

### Manual Testing Steps

1. **Start the application:**
   ```bash
   pnpm run dev:backend
   ```

2. **Open Swagger UI:**
   ```
   http://localhost:3000/api/docs
   ```

3. **Test endpoints:**
   - Navigate to **Users** tag
   - Click "Try it out" on any endpoint
   - Fill in parameters
   - Click "Execute"
   - Review response

### Test Scenarios

#### 1. Get Current User Profile

**Endpoint:** `GET /api/users/me`

**Test Cases:**
- ✅ Valid request returns user profile
- ❌ Missing token returns 401
- ❌ Invalid token returns 401
- ❌ User not found returns 404

#### 2. Update Profile

**Endpoint:** `PATCH /api/users/me`

**Test Cases:**
- ✅ Valid update succeeds
- ✅ Partial update works (only name)
- ✅ Preferences merge correctly
- ❌ Invalid URL for avatar returns 400
- ❌ Invalid data type returns 400

#### 3. Get User by ID

**Endpoint:** `GET /api/users/:id`

**Test Cases:**
- ✅ Valid ID returns user
- ❌ Invalid ID returns 404
- ❌ Non-admin returns 403

#### 4. Update Status

**Endpoint:** `PATCH /api/users/:id/status`

**Test Cases:**
- ✅ Admin can update status
- ✅ Status change is saved
- ❌ Non-admin returns 403
- ❌ Self-suspension returns 400
- ❌ Invalid status returns 400

#### 5. Get All Users

**Endpoint:** `GET /api/users`

**Test Cases:**
- ✅ Returns paginated list
- ✅ Status filter works
- ✅ Pagination works correctly
- ❌ Non-admin returns 403

## Test Data Setup

### Seed Script

**File:** `apps/backend/scripts/seed-users.ts`

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/modules/user/user.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  // Create test users
  const users = [
    {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    },
    {
      email: 'user@example.com',
      name: 'Test User',
      role: 'user',
    },
  ];

  for (const userData of users) {
    // Create user logic here
  }

  await app.close();
}

seed();
```

### Running Seed Script

```bash
# Add to package.json scripts
"seed:users": "ts-node -r tsconfig-paths/register scripts/seed-users.ts"

# Run seed
pnpm --filter backend seed:users
```

## Mock Data

### Test User Objects

```typescript
export const mockUser = {
  id: '507f1f77bcf86cd799439011',
  email: 'user@example.com',
  name: 'John Doe',
  avatar: 'https://example.com/avatar.jpg',
  locale: 'en',
  timezone: 'America/New_York',
  role: 'user',
  status: 'active',
  preferences: {
    theme: 'dark',
    notifications: true,
  },
  emailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockAdmin = {
  ...mockUser,
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
};
```

## Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** All endpoints covered
- **E2E Tests:** Critical user flows

## Continuous Testing

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm --filter backend test --passWithNoTests"
    }
  }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: |
    pnpm --filter backend test
    pnpm --filter backend test:e2e
```

## Troubleshooting

### Common Issues

1. **Tests failing due to database:**
   - Use in-memory database for tests
   - Mock database operations
   - Clean up test data

2. **Authentication in tests:**
   - Mock JWT guards
   - Use test tokens
   - Bypass auth for unit tests

3. **Async operations:**
   - Use `async/await` properly
   - Wait for promises
   - Handle timeouts

## Next Steps

- [ ] Write unit tests for all service methods
- [ ] Write integration tests for all endpoints
- [ ] Set up test database
- [ ] Add test coverage reporting
- [ ] Set up CI/CD testing

