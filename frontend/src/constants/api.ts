import { Platform } from "react-native";

// =====================================================
// CONFIGURAÇÃO DO IP DO BACKEND
// =====================================================
// Para CELULAR FÍSICO: use o IP local da sua máquina (atual: 10.0.0.116)
// Para EMULADOR ANDROID: use 10.0.2.2
// Para iOS SIMULATOR ou WEB: use localhost
// =====================================================

const USE_PHYSICAL_DEVICE = true; // Mude para false se usar emulador

function getBaseUrl(): string {
  if (USE_PHYSICAL_DEVICE) {
    return "http://10.0.0.116:8080"; // IP local da sua máquina
  }

  // Configuração para emuladores
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }
  return "http://localhost:8080";
}

export const API_BASE_URL = getBaseUrl();
