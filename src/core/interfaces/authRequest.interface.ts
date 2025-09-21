export interface AuthRequest {
  email: string;
  password: string;
  apiKey: string;
}

export interface ChangePasswordRequest {
  userId: number;
  newPassword: string;
}
