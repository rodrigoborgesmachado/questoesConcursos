export function requireRole(role, allowedRoles = []) {
  return allowedRoles.includes(role);
}
