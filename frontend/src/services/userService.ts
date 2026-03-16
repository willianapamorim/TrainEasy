import api from "@/src/services/api";
import { AuthResponse } from "@/src/services/authService";
import { AxiosError } from "axios";

interface UpdateUserPayload {
  nome?: string;
  email?: string;
  senha?: string;
}

export async function getUser(id: number): Promise<AuthResponse> {
  try {
    const { data } = await api.get<AuthResponse>(`/users/${id}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<AuthResponse> {
  try {
    const { data } = await api.put<AuthResponse>(`/users/${id}`, payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteUser(id: number): Promise<AuthResponse> {
  try {
    const { data } = await api.delete<AuthResponse>(`/users/${id}`);
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
