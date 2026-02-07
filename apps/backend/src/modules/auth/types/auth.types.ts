import { UserRole } from '../../user/enums';

/**
 * JWT payload structure
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

/**
 * Token response
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/**
 * Login response
 */
export interface LoginResponse extends TokenResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

/**
 * Register input
 */
export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

/**
 * Login input
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Refresh token input
 */
export interface RefreshTokenInput {
  refreshToken: string;
}
