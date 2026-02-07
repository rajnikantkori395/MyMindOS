/**
 * User status enumeration
 * Defines the status states for user accounts
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

/**
 * User status display names
 */
export const UserStatusDisplay: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Active',
  [UserStatus.INACTIVE]: 'Inactive',
  [UserStatus.SUSPENDED]: 'Suspended',
};

/**
 * Check if status allows user to access the system
 */
export function isActiveStatus(status: UserStatus): boolean {
  return status === UserStatus.ACTIVE;
}
