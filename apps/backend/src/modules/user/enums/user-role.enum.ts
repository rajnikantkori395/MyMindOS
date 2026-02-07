/**
 * User role enumeration
 * Defines the roles available in the system
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

/**
 * User role display names
 */
export const UserRoleDisplay: Record<UserRole, string> = {
  [UserRole.USER]: 'User',
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.SUPERADMIN]: 'Super Administrator',
};

/**
 * Check if a role is admin
 */
export function isAdminRole(role: UserRole): boolean {
  return role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
}

/**
 * Check if a role is superadmin
 */
export function isSuperAdminRole(role: UserRole): boolean {
  return role === UserRole.SUPERADMIN;
}
