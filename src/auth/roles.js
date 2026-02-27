export const Roles = Object.freeze({
  Admin: 'admin',
  Teacher: 'teacher',
  User: 'user',
});

export function mapAdminValueToRole(adminValue) {
  if (adminValue === '1' || adminValue === 1) return Roles.Admin;
  if (adminValue === '2' || adminValue === 2) return Roles.Teacher;
  return Roles.User;
}
