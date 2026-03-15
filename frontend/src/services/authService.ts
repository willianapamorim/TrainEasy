import api from "@/src/services/api";
import { AxiosError } from "axios";

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
  try {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error: unknown): AuthResponse {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    return {
      success: data.success ?? false,
      message: data.message ?? "Erro desconhecido.",
      user: null,
    };
  }

  return {
    success: false,
    message: "Não foi possível conectar ao servidor.",
    user: null,
  };
}
