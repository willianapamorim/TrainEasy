import api from "@/src/services/api";
import { AxiosError } from "axios";

export interface MetaData {
  id: number;
  titulo: string;
  descricao: string | null;
  concluida: boolean;
  userId: number;
  createdAt: string;
}

export interface MetaResponse {
  success: boolean;
  message: string;
  meta: MetaData | null;
  metas: MetaData[] | null;
}

interface CreateMetaPayload {
  titulo: string;
  descricao?: string;
  userId: number;
}

interface UpdateMetaPayload {
  titulo?: string;
  descricao?: string;
  concluida?: boolean;
  userId: number;
}

export async function criarMeta(
  payload: CreateMetaPayload,
): Promise<MetaResponse> {
  try {
    const { data } = await api.post<MetaResponse>("/metas", payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function listarMetas(userId: number): Promise<MetaResponse> {
  try {
    const { data } = await api.get<MetaResponse>(`/metas/user/${userId}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function atualizarMeta(
  id: number,
  payload: UpdateMetaPayload,
): Promise<MetaResponse> {
  try {
    const { data } = await api.put<MetaResponse>(`/metas/${id}`, payload);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

export async function excluirMeta(id: number): Promise<MetaResponse> {
  try {
    const { data } = await api.delete<MetaResponse>(`/metas/${id}`);
    return data;
  } catch (error) {
    return handleError(error);
  }
}

function handleError(error: unknown): MetaResponse {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    return {
      success: data.success ?? false,
      message: data.message ?? "Erro desconhecido.",
      meta: null,
      metas: null,
    };
  }
  return {
    success: false,
    message: "Não foi possível conectar ao servidor.",
    meta: null,
    metas: null,
  };
}
