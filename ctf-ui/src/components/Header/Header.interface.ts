/**
 * Header Component Type Definitions
 */

export interface DbtProject {
  id: string;
  name: string;
  repository: string;
  branch: string;
  isActive?: boolean;
}

export interface UserData {
  username: string;
  email: string;
  roles: string[];
}
