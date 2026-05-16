import api from "@/src/services/api";
import { AxiosError } from "axios";

// ── Interfaces ──────────────────────────────────────────────

export interface CategoriaVideo {
  nome: string;
  quantidadeVideos: number;
}

export interface VideoExercicio {
  nomeExercicio: string;
  categoria: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export interface VideoResponse {
  success: boolean;
  message: string;
  categorias: CategoriaVideo[] | null;
  videos: VideoExercicio[] | null;
}

// ── API calls ───────────────────────────────────────────────

export async function getCategorias(): Promise<VideoResponse> {
  try {
    const { data } = await api.get<VideoResponse>("/videos/categorias");
    return data;
  } catch (error) {
    return handleVideoError(error);
  }
}

export async function getVideosByCategoria(
  categoria: string,
): Promise<VideoResponse> {
  try {
    const { data } = await api.get<VideoResponse>(
      `/videos/categoria/${encodeURIComponent(categoria)}`,
    );
    return data;
  } catch (error) {
    return handleVideoError(error);
  }
}

// ── Error handling ──────────────────────────────────────────

function handleVideoError(error: unknown): VideoResponse {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data;
    return {
      success: data.success ?? false,
      message: data.message ?? "Erro desconhecido.",
      categorias: null,
      videos: null,
    };
  }
  return {
    success: false,
    message: "Não foi possível conectar ao servidor.",
    categorias: null,
    videos: null,
  };
}
