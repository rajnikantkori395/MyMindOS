# Frontend Structure Documentation

This document outlines the frontend architecture and structure for the MyMindOS application.

## 📁 Project Structure

```
apps/frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   │   ├── signin/          # Sign in page
│   │   ├── signup/          # Sign up page
│   │   └── layout.tsx       # Auth layout
│   ├── dashboard/           # Dashboard (protected)
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (redirects)
│   └── providers.tsx        # Redux provider wrapper
├── components/              # React components
│   └── common/              # Reusable UI components
│       ├── Button.tsx       # Button component
│       ├── Input.tsx        # Input component
│       ├── Form.tsx         # Form wrapper
│       └── index.ts         # Barrel export
├── config/                  # Configuration files
│   └── api.config.ts        # API endpoints configuration
├── lib/                     # Core libraries and utilities
│   ├── api/                 # API client setup
│   │   ├── baseApi.ts       # RTK Query base API
│   │   ├── authApi.ts       # Auth API endpoints
│   │   └── userApi.ts       # User API endpoints
│   ├── store/               # Redux store
│   │   ├── index.ts         # Store configuration
│   │   ├── hooks.ts         # Typed Redux hooks
│   │   └── slices/          # Redux slices
│   │       └── authSlice.ts # Auth state management
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Auth operations hook
│   │   ├── useRequireAuth.ts # Route protection hook
│   │   └── index.ts         # Barrel export
│   ├── validations/         # Form validation schemas
│   │   └── auth.schema.ts   # Auth form schemas (Zod)
│   └── utils.ts             # Utility functions
├── middleware.ts            # Next.js middleware
└── package.json            # Dependencies
```

## 🏗️ Architecture Overview

### State Management

**Redux Toolkit + RTK Query**
- Centralized state management with Redux Toolkit
- Server state management with RTK Query
- Automatic caching and refetching
- Type-safe API calls

**Auth State**
- Stored in Redux store (`authSlice`)
- Persisted to localStorage
- Automatic token refresh on 401 errors
- Type-safe with TypeScript

### API Client

**Centralized API Configuration**
- Base URL configured in `config/api.config.ts`
- Environment variable: `NEXT_PUBLIC_API_URL`
- Automatic token injection in headers
- Token refresh on authentication errors

**RTK Query Endpoints**
- `authApi`: Authentication endpoints (login, register, logout, refresh)
- `userApi`: User profile endpoints (get, update)

### Components

**Reusable UI Components**
- `Button`: Styled button with variants and loading states
- `Input`: Form input with label, error, and helper text
- `Form`: Form wrapper component

All components support:
- Dark mode
- Accessibility (ARIA attributes)
- TypeScript types
- Tailwind CSS styling

### Custom Hooks

**useAuth**
- Provides authentication state and operations
- Handles login, register, logout
- Manages loading states
- Automatic navigation after auth actions

**useRequireAuth**
- Protects routes that require authentication
- Redirects to signin if not authenticated
- Useful for protected pages

### Form Validation

**Zod Schemas**
- Type-safe form validation
- Client-side validation with react-hook-form
- Error messages displayed in forms
- Password requirements matching backend

## 🔐 Authentication Flow

1. **Sign Up/Login**
   - User submits form with validation
   - API call via RTK Query mutation
   - On success: tokens stored in Redux + localStorage
   - Redirect to dashboard

2. **Token Management**
   - Access token in Authorization header
   - Refresh token used for token refresh
   - Automatic refresh on 401 errors
   - Logout clears all tokens

3. **Protected Routes**
   - Client-side check with `useRequireAuth`
   - Redirects to signin if not authenticated
   - Dashboard and other protected pages

## 🚀 Usage Examples

### Using Auth Hook

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Login
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Redirected automatically
    }
  };
  
  return <div>{user?.name}</div>;
}
```

### Using API Endpoints

```tsx
import { useGetProfileQuery, useUpdateProfileMutation } from '@/lib/api/userApi';

function ProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  
  const handleUpdate = async () => {
    await updateProfile({ name: 'New Name' });
  };
  
  return <div>{profile?.name}</div>;
}
```

### Protected Route

```tsx
import { useRequireAuth } from '@/lib/hooks/useRequireAuth';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null; // Redirecting
  
  return <div>Protected Content</div>;
}
```

## 📦 Dependencies

### Core
- `next`: 16.0.1 - React framework
- `react`: 19.2.0 - UI library
- `typescript`: ^5 - Type safety

### State Management
- `@reduxjs/toolkit`: ^2.11.2 - Redux Toolkit
- `react-redux`: ^9.2.0 - React bindings

### Forms & Validation
- `react-hook-form`: ^7.70.0 - Form handling
- `@hookform/resolvers`: ^5.2.2 - Validation resolvers
- `zod`: ^4.3.5 - Schema validation

### Styling
- `tailwindcss`: ^4 - Utility-first CSS
- `clsx`: ^2.1.1 - Conditional classes
- `tailwind-merge`: ^3.4.0 - Merge Tailwind classes

## 🔧 Configuration

### Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### API Configuration

Edit `config/api.config.ts` to update:
- Base URL
- Endpoint paths
- Timeout settings

## 🎨 Styling

- **Tailwind CSS 4**: Utility-first styling
- **Dark Mode**: Automatic dark mode support
- **Responsive**: Mobile-first design
- **Accessibility**: ARIA attributes and semantic HTML

## 📝 Best Practices

1. **Type Safety**: All components and hooks are fully typed
2. **Error Handling**: Proper error states in forms and API calls
3. **Loading States**: Loading indicators for async operations
4. **Code Organization**: Clear separation of concerns
5. **Reusability**: Components and hooks are reusable
6. **Scalability**: Easy to add new features and endpoints

## 🔄 Adding New Features

### Adding a New API Endpoint

1. Add endpoint to `lib/api/[feature]Api.ts`
2. Export hooks from the API slice
3. Use in components with RTK Query hooks

### Adding a New Component

1. Create component in `components/[category]/`
2. Export from `components/[category]/index.ts`
3. Use TypeScript for props
4. Support dark mode and accessibility

### Adding a New Protected Route

1. Create page in `app/[route]/page.tsx`
2. Use `useRequireAuth()` hook
3. Add route to middleware if needed

## 🐛 Troubleshooting

### Token Not Persisting
- Check localStorage in browser DevTools
- Verify authSlice reducer is working
- Check if tokens are being set correctly

### API Calls Failing
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check network tab for request/response
- Verify backend is running and accessible

### Redirects Not Working
- Check `useAuth` hook implementation
- Verify router is being used correctly
- Check middleware configuration

