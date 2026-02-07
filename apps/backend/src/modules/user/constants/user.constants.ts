/**
 * User module constants
 */

/**
 * Default user preferences
 */
export const DEFAULT_USER_PREFERENCES = {
  theme: 'light',
  notifications: true,
  language: 'en',
} as const;

/**
 * Default locale
 */
export const DEFAULT_LOCALE = 'en';

/**
 * Pagination defaults
 */
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/**
 * User collection name
 */
export const USER_COLLECTION_NAME = 'users';

/**
 * User field names (for queries and updates)
 */
export const USER_FIELDS = {
  ID: '_id',
  EMAIL: 'email',
  NAME: 'name',
  AVATAR: 'avatar',
  LOCALE: 'locale',
  TIMEZONE: 'timezone',
  ROLE: 'role',
  STATUS: 'status',
  PREFERENCES: 'preferences',
  LAST_LOGIN_AT: 'lastLoginAt',
  EMAIL_VERIFIED: 'emailVerified',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
