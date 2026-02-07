# Login Credentials

## Seeded Users

After running the seeder (`pnpm --filter backend seed`), you can login with:

### Superadmin
- **Email**: `superadmin@mymindos.com` ⚠️ **Note: single 'i' in mymindos**
- **Password**: `Password123!`
- **Role**: SUPERADMIN

### Admins
- **Email**: `admin@mymindos.com`
- **Password**: `Password123!`
- **Role**: ADMIN

- **Email**: `admin2@mymindos.com`
- **Password**: `Password123!`
- **Role**: ADMIN

### Test Users
- **Email**: `test@mymindos.com`
- **Password**: `Password123!`
- **Role**: USER

- **Email**: `demo@mymindos.com`
- **Password**: `Password123!`
- **Role**: USER

## Common Mistakes

### ❌ Wrong Email
- `superadmin@mymiindos.com` (double 'i')
- `superadmin@mymindos.com` (missing 's')
- `superadmin@mymindos` (missing .com)

### ✅ Correct Email
- `superadmin@mymindos.com` (single 'i', with .com)

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

Default password for all seeded users: `Password123!`

## Troubleshooting

### "Invalid credentials" Error

1. **Check email spelling**: Make sure it's `mymindos.com` (single 'i'), not `mymiindos.com`
2. **Check password**: Default is `Password123!` (case sensitive)
3. **Check if user exists**: Run seeder if you haven't: `pnpm --filter backend seed`
4. **Check backend logs**: Look for "User not found" or "Invalid password" messages

### Browser Autocomplete Issue

If your browser autocompletes the wrong email:
1. Clear browser autocomplete for this site
2. Type the email manually
3. Or use incognito/private mode

## Testing

### Via Swagger UI
1. Open `http://localhost:4000/api/docs`
2. Try the `/api/auth/login` endpoint
3. Use: `superadmin@mymindos.com` / `Password123!`

### Via Frontend
1. Open `http://localhost:3000/signin`
2. Enter: `superadmin@mymindos.com` / `Password123!`
3. Click "Sign in"

### Via curl
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@mymindos.com","password":"Password123!"}'
```
