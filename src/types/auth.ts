export type UserRole = 'USER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  status: UserStatus;
}
