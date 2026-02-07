# Database Seeding Guide

This guide explains how to seed the database with initial data for development and testing.

## Overview

The seeder creates initial users including:
- **Superadmins**: Full system access
- **Admins**: Administrative access
- **Test Users**: Regular users for testing

## Quick Start

### Run the Seeder

```bash
# From the project root
pnpm --filter backend seed

# Or from apps/backend directory
pnpm seed
```

## Seeded Users

After running the seeder, the following users will be created:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| `superadmin@mymindos.com` | `Password123!` | SUPERADMIN | Active |
| `admin@mymindos.com` | `Password123!` | ADMIN | Active |
| `admin2@mymindos.com` | `Password123!` | ADMIN | Active |
| `test@mymindos.com` | `Password123!` | USER | Active |
| `demo@mymindos.com` | `Password123!` | USER | Active |

⚠️ **Important**: Change these default passwords in production!

## User Roles

### SUPERADMIN
- Full system access
- Can perform all admin operations
- Can access all admin endpoints

### ADMIN
- Administrative access
- Can manage users
- Can access admin endpoints

### USER
- Regular user access
- Can manage own profile
- Limited access to system features

## Seeder Structure

```
apps/backend/
├── src/
│   └── database/
│       └── seeders/
│           ├── user.seeder.ts      # User seeding logic
│           └── seeder.module.ts    # Seeder module
└── scripts/
    └── seed.ts                     # Seed script entry point
```

## Customizing Seed Data

To modify the seed data, edit `apps/backend/src/database/seeders/user.seeder.ts`:

```typescript
private getSeedUsers(): SeedUser[] {
  return [
    {
      email: 'your-email@example.com',
      name: 'Your Name',
      password: 'YourPassword123!',
      role: UserRole.SUPERADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      preferences: {
        theme: 'dark',
        notifications: true,
      },
    },
    // Add more users...
  ];
}
```

## Running in Different Environments

### Development
```bash
pnpm --filter backend seed
```

### Production
⚠️ **Warning**: Only run seeders in production if absolutely necessary and with proper backups.

```bash
NODE_ENV=production pnpm --filter backend seed
```

## Troubleshooting

### Users Already Exist
The seeder checks if users already exist by email. If a user exists, it will skip seeding that user and log a message.

### Database Connection Issues
Ensure MongoDB is running and the connection string in `.env` is correct:

```env
MONGO_URI=mongodb://localhost:27017/mymindos
```

### Build Errors
If you encounter build errors, ensure all dependencies are installed:

```bash
pnpm install
pnpm --filter backend build
```

## Adding New Seeders

To add seeders for other entities:

1. Create a new seeder class in `src/database/seeders/`:
   ```typescript
   @Injectable()
   export class YourEntitySeeder {
     async seed(): Promise<void> {
       // Seeding logic
     }
   }
   ```

2. Add it to `SeederModule`:
   ```typescript
   @Module({
     providers: [UserSeeder, YourEntitySeeder],
     exports: [UserSeeder, YourEntitySeeder],
   })
   export class SeederModule {}
   ```

3. Call it in `scripts/seed.ts`:
   ```typescript
   const yourEntitySeeder = app.get(YourEntitySeeder);
   await yourEntitySeeder.seed();
   ```

## Security Notes

- Default passwords are for development only
- Always change default passwords in production
- Consider using environment variables for sensitive seed data
- Never commit production passwords to version control
