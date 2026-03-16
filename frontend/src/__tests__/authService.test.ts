import api from "@/src/services/api";
import { loginUser, registerUser } from "@/src/services/authService";

jest.mock("@/src/services/api");

const mockedApi = api as jest.Mocked<typeof api>;

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== REGISTRO ====================

  describe("registerUser", () => {
    it("deve retornar sucesso ao registrar com dados válidos", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Conta criada com sucesso!",
          user: { id: 1, nome: "João", email: "joao@email.com" },
        },
      };
      mockedApi.post.mockResolvedValueOnce(mockResponse);

      const result = await registerUser({
        nome: "João",
        email: "joao@email.com",
        senha: "123456",
      });

      expect(mockedApi.post).toHaveBeenCalledWith("/auth/register", {
        nome: "João",
        email: "joao@email.com",
        senha: "123456",
      });
      expect(result.success).toBe(true);
      expect(result.user?.nome).toBe("João");
    });

    it("deve retornar erro quando o email já existe", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            success: false,
            message: "Email já cadastrado: joao@email.com",
            user: null,
          },
        },
      };
      // Simula AxiosError
      const error = Object.assign(new Error(), axiosError);
      Object.defineProperty(error, "constructor", {
        value: class {
          static name = "AxiosError";
        },
      });
      mockedApi.post.mockRejectedValueOnce(error);

      const result = await registerUser({
        nome: "João",
        email: "joao@email.com",
        senha: "123456",
      });

      expect(result.success).toBe(false);
    });

    it("deve retornar erro de conexão quando servidor está fora", async () => {
      mockedApi.post.mockRejectedValueOnce(new Error("Network Error"));

      const result = await registerUser({
        nome: "João",
        email: "joao@email.com",
        senha: "123456",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Não foi possível conectar ao servidor.");
    });
  });

  // ==================== LOGIN ====================

  describe("loginUser", () => {
    it("deve retornar sucesso ao fazer login com credenciais válidas", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Login realizado com sucesso!",
          user: { id: 1, nome: "João", email: "joao@email.com" },
        },
      };
      mockedApi.post.mockResolvedValueOnce(mockResponse);

      const result = await loginUser({
        email: "joao@email.com",
        senha: "123456",
      });

      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "joao@email.com",
        senha: "123456",
      });
      expect(result.success).toBe(true);
      expect(result.user?.email).toBe("joao@email.com");
    });

    it("deve retornar erro com email inexistente", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            success: false,
            message: "Usuário não encontrado",
            user: null,
          },
        },
      };
      const error = Object.assign(new Error(), axiosError);
      mockedApi.post.mockRejectedValueOnce(error);

      const result = await loginUser({
        email: "naoexiste@email.com",
        senha: "123456",
      });

      expect(result.success).toBe(false);
    });

    it("deve retornar erro com senha incorreta", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            success: false,
            message: "Senha incorreta",
            user: null,
          },
        },
      };
      const error = Object.assign(new Error(), axiosError);
      mockedApi.post.mockRejectedValueOnce(error);

      const result = await loginUser({
        email: "joao@email.com",
        senha: "senhaerrada",
      });

      expect(result.success).toBe(false);
    });

    it("deve retornar erro de conexão quando servidor está fora", async () => {
      mockedApi.post.mockRejectedValueOnce(new Error("Network Error"));

      const result = await loginUser({
        email: "joao@email.com",
        senha: "123456",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Não foi possível conectar ao servidor.");
    });
  });
});
