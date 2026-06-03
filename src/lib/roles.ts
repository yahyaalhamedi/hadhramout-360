/**
 * Backend identity roles — must match the C# IdentityRoles class.
 */
export const Roles = {
  Admin: 'Admin',
  ContentManager: 'ContentManager',
  Organization: 'Organization',
  User: 'User',
} as const

export type Role = (typeof Roles)[keyof typeof Roles]

/** Check if the user has a specific role. */
export function hasRole(userRoles: string[], role: Role): boolean {
  return userRoles.includes(role)
}

/** Check if the user has at least one of the given roles. */
export function hasAnyRole(userRoles: string[], roles: Role[]): boolean {
  return roles.some((role) => userRoles.includes(role))
}
