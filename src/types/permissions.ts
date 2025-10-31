import { UserRole } from './roles';

// Define which roles each role can create
export const ROLE_CREATION_PERMISSIONS: Record<UserRole, UserRole[]> = {
  'super-admin': [
    'super-admin',
    'executive-admin',
    'cluster-head',
    'user-head',
    'nurse',
    'technician',
    'doctor',
  ],
  'executive-admin': [
    'executive-admin',
    'cluster-head',
    'user-head',
    'nurse',
    'technician',
    'doctor',
  ],
  'cluster-head': ['user-head', 'nurse', 'technician', 'doctor'],
  'user-head': ['nurse', 'technician', 'doctor'],
  'nurse': [],
  'technician': [],
  'doctor': [],
  'user': [],
};

export const canCreateRole = (
  currentUserRole: UserRole,
  targetRole: UserRole
): boolean => {
  const allowedRoles = ROLE_CREATION_PERMISSIONS[currentUserRole];
  return allowedRoles.includes(targetRole);
};

export const getAllowedRolesToCreate = (currentUserRole: UserRole): UserRole[] => {
  return ROLE_CREATION_PERMISSIONS[currentUserRole];
};
