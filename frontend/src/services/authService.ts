import { API_BASE_URL } from "@/src/constants/api";

interface RegisterPayload {
  nome: string;
  email: string;
  senha: string;
}

interface LoginPayload {
  email: string;
  senha: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    nome: string;
    email: string;
  } | null;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}
