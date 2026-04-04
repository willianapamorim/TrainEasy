import api from "@/src/services/api";
import { AxiosError } from "axios";

export interface TreinoData {
  id: number;
  nome: string;
  tipo: string;
  userId: number;
  createdAt: string;
}

export interface ExercicioData {
  id: number;
  nome: string;
}

export interface DivisaoData {
  id: number;
  nome: string;
  exercicios: ExercicioData[];
}

export interface TreinoCompletoData {
  id: number;
  nome: string;
  tipo: string;
  userId: number;
  createdAt: string;
  divisoes: DivisaoData[];
}

export interface TreinoResponse {
  success: boolean;
  message: string;
  treino: TreinoData | null;
  treinos: TreinoData[] | null;
}

export interface TreinoCompletoResponse {
  success: boolean;
  message: string;
  treino: TreinoCompletoData | null;
  treinos: TreinoCompletoData[] | null;
}

export interface RegistroData {
  id: number;
  exercicioId: number;
  exercicioNome: string;
  userId: number;
  carga: number;
  repeticoes: number;
  numeroSerie: number;
  createdAt: string;
}

export interface RegistroResponse {
  success: boolean;
  message: string;
  registro: RegistroData | null;
  registros: RegistroData[] | null;
}

interface CreateTreinoPayload {
  nome: string;
  tipo: string;
  userId: number;
}

interface DivisaoPayload {
  nome: string;
  exercicios: string[];
}

interface CreateTreinoCompletoPayload {
  nome: string;
  tipo: string;
  userId: number;
  divisoes: DivisaoPayload[];
}

interface RegistroExercicioPayload {
  exercicioId: number;
  userId: number;
  carga: number;
  repeticoes: number;
  numeroSerie: number;
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

export async function createTreinoCompleto(
  payload: CreateTreinoCompletoPayload,
): Promise<TreinoCompletoResponse> {
  try {
    const { data } = await api.post<TreinoCompletoResponse>(
      "/treinos/completo",
      payload,
    );
    return data;
  } catch (error) {
    return handleCompletoError(error);
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

export async function getTreinosCompletosByUser(
  userId: number,
): Promise<TreinoCompletoResponse> {
  try {
    const { data } = await api.get<TreinoCompletoResponse>(
      `/treinos/user/${userId}/completo`,
    );
    return data;
  } catch (error) {
    return handleCompletoError(error);
  }
}

export async function getTreinoCompleto(
  id: number,
): Promise<TreinoCompletoResponse> {
  try {
    const { data } = await api.get<TreinoCompletoResponse>(
      `/treinos/${id}/completo`,
    );
    return data;
  } catch (error) {
    return handleCompletoError(error);
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

export async function updateDivisaoExercicios(
  divisaoId: number,
  exercicios: string[],
): Promise<TreinoCompletoResponse> {
  try {
    const { data } = await api.put<TreinoCompletoResponse>(
      `/treinos/divisoes/${divisaoId}/exercicios`,
      exercicios,
    );
    return data;
  } catch (error) {
    return handleCompletoError(error);
  }
}

export async function registrarExercicio(
  payload: RegistroExercicioPayload,
): Promise<RegistroResponse> {
  try {
    const { data } = await api.post<RegistroResponse>("/registros", payload);
    return data;
  } catch (error) {
    return handleRegistroError(error);
  }
}

export async function getRegistrosByExercicio(
  exercicioId: number,
  userId: number,
): Promise<RegistroResponse> {
  try {
    const { data } = await api.get<RegistroResponse>(
      `/registros/exercicio/${exercicioId}?userId=${userId}`,
    );
    return data;
  } catch (error) {
    return handleRegistroError(error);
  }
}

export async function deleteRegistro(id: number): Promise<RegistroResponse> {
  try {
    const { data } = await api.delete<RegistroResponse>(`/registros/${id}`);
    return data;
  } catch (error) {
    return handleRegistroError(error);
  }
}

export async function updateRegistro(
  id: number,
  payload: RegistroExercicioPayload,
): Promise<RegistroResponse> {
  try {
    const { data } = await api.put<RegistroResponse>(
      `/registros/${id}`,
      payload,
    );
    return data;
  } catch (error) {
    return handleRegistroError(error);
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

function handleCompletoError(error: unknown): TreinoCompletoResponse {
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

function handleRegistroError(error: unknown): RegistroResponse {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    return {
      success: data.success ?? false,
      message: data.message ?? "Erro desconhecido.",
      registro: null,
      registros: null,
    };
  }
  return {
    success: false,
    message: "Não foi possível conectar ao servidor.",
    registro: null,
    registros: null,
  };
}
