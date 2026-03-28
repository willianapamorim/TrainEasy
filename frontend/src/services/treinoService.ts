import api from "@/src/services/api";
import { AxiosError } from "axios";

export interface TreinoData {
  id: number;
  nome: string;
  tipo: string;
  userId: number;
  createdAt: string;
}

export interface TreinoResponse {
  success: boolean;
  message: string;
  treino: TreinoData | null;
  treinos: TreinoData[] | null;
}

interface CreateTreinoPayload {
  nome: string;
  tipo: string;
  userId: number;
}

export async function createTreino(
  payload: CreateTreinoPayload,
): Promise<TreinoResponse> {
  try {
    const { data } = await api.post<TreinoResponse>("/treinos", payload);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function getTreinosByUser(
  userId: number,
): Promise<TreinoResponse> {
  try {
    const { data } = await api.get<TreinoResponse>(`/treinos/user/${userId}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function deleteTreino(id: number): Promise<TreinoResponse> {
  try {
    const { data } = await api.delete<TreinoResponse>(`/treinos/${id}`);
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

function handleApiError(error: unknown): TreinoResponse {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    return {
      success: data.success ?? false,
      message: data.message ?? "Erro desconhecido.",
      treino: null,
      treinos: null,
    };
  }
  return {
    success: false,
    message: "Não foi possível conectar ao servidor.",
    treino: null,
    treinos: null,
  };
}
