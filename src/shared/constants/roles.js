export const ROLES = Object.freeze({
  STUDENT: 'STUDENT',
  TRAINER: 'TRAINER',
  ADMIN: 'ADMIN',
});

export const ROLE_LIST = [ROLES.STUDENT, ROLES.TRAINER, ROLES.ADMIN];

export const ROLE_LABELS = Object.freeze({
  [ROLES.STUDENT]: 'Student',
  [ROLES.TRAINER]: 'Trainer',
  [ROLES.ADMIN]: 'Admin',
});

/** When a user has several roles, the first match decides where they land after login. */
export const ROLE_PRIORITY = [ROLES.ADMIN, ROLES.TRAINER, ROLES.STUDENT];

export function hasRole(user, role) {
  if (!user || !role) return false;
  const target = String(role).toUpperCase();
  if (typeof user.role === 'string' && user.role.toUpperCase() === target) {
    return true;
  }
  if (Array.isArray(user.roles)) {
    return user.roles.some((r) => {
      if (typeof r === 'string') return r.toUpperCase() === target;
      if (typeof r === 'object' && r !== null) {
        if (typeof r.name === 'string') return r.name.toUpperCase() === target;
        if (typeof r.role === 'string') return r.role.toUpperCase() === target;
        if (typeof r.role?.name === 'string') return r.role.name.toUpperCase() === target;
      }
      return false;
    });
  }
  return false;
}

export function hasAnyRole(user, roles = []) {
  if (!roles || roles.length === 0) return true;
  return roles.some((role) => hasRole(user, role));
}

export function getPrimaryRole(user) {
  return ROLE_PRIORITY.find((role) => hasRole(user, role)) ?? ROLES.STUDENT;
}
