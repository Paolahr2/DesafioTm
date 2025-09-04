export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  fullName?: string;  // Agregamos fullName como opcional para compatibilidad
  createdAt?: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
