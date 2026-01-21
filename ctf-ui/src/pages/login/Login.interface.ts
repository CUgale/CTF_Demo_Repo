export interface User {
  user:
  {
    id: number;
    username: string;
    email: string;
    roles: string[];
    updated_at: string;
  }
}

// Representing the [User, null] array structure precisely
export type LoginResponse = [User];

export interface LoginRequestPayload {
  username: string;
  password: string;
}

// Sub-state interface following Admin standards
export interface AuthSubState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthState {
  login: AuthSubState;
  currentUser: AuthSubState;
  isAuthenticated: boolean;
}