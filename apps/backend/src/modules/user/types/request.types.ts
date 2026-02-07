import { Request } from 'express';

/**
 * Authenticated user payload (from JWT token)
 * This will be populated by the Auth module's JWT strategy
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}
