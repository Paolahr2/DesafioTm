// ============================================================================
// INTERFACES ACTUALIZADAS PARA BACKEND CLEAN ARCHITECTURE 
// ============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  name?: string; // Para compatibilidad legacy
  createdAt?: string;
}

// DTO para Login - coincide con LoginRequestDto del backend
export interface LoginData {
  emailOrUsername: string;
  password: string;
}

// DTO para Register - coincide con RegisterRequestDto del backend  
export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

// Response del Auth - coincide con AuthResponseDto del backend
export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  success?: boolean;
}

// Para endpoints de usuarios
export interface UpdateUserDto {
  fullName?: string;
  username?: string;
  email?: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  fullName: string;
  createdAt: string;
}
