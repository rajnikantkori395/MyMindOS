import { UserRole, UserStatus } from '../enums';

/**
 * User preferences type
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: boolean;
  language?: string;
  [key: string]: any; // Allow additional preferences
}

/**
 * User document type (Mongoose document)
 */
export interface IUser {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  locale: string;
  timezone?: string;
  role: UserRole;
  status: UserStatus;
  preferences: UserPreferences;
  lastLoginAt?: Date;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User creation input
 */
export interface CreateUserInput {
  email: string;
  name: string;
  passwordHash?: string;
  avatar?: string;
  locale?: string;
  timezone?: string;
  role?: UserRole;
  status?: UserStatus;
  preferences?: UserPreferences;
  emailVerified?: boolean;
}

/**
 * User update input
 */
export interface UpdateUserInput {
  name?: string;
  avatar?: string;
  locale?: string;
  timezone?: string;
  preferences?: Partial<UserPreferences>;
  lastLoginAt?: Date;
  emailVerified?: boolean;
  status?: UserStatus;
  role?: UserRole;
}

/**
 * User query filters
 */
export interface UserQueryFilters {
  status?: UserStatus;
  role?: UserRole;
  email?: string;
  emailVerified?: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * User list response
 */
export type UserListResponse = PaginatedResponse<any>; // Using any to match Mongoose User document
