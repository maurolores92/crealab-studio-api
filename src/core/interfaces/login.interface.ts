import { IRole } from '@src/modules/users/role/roles.model';

export interface LoginResponse {
  id: number;
  email?: string;
  fullName: string;
  username: string;
  role: IRole;
  roleId: number;
  accessToken: string;
  refreshToken: string;
  type?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  type?: string;
}

export interface BodyToken {
  id: number;
  email?: string;
  fullName: string;
  username: string;
  role: IRole;
  roleId: number;
  date: Date;
  type?: string;
}
