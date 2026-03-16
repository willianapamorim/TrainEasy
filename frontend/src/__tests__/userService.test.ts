import api from "@/src/services/api";
import { deleteUser, getUser, updateUser } from "@/src/services/userService";

jest.mock("@/src/services/api");

const mockedApi = api as jest.Mocked<typeof api>;

describe("userService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== GET USER ====================

  describe("getUser", () => {
    it("deve retornar dados do usuário com id válido", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Usuário encontrado",
          user: { id: 1, nome: "João", email: "joao@email.com" },
        },
      };
      mockedApi.get.mockResolvedValueOnce(mockResponse);

      const result = await getUser(1);

      expect(mockedApi.get).toHaveBeenCalledWith("/users/1");
      expect(result.success).toBe(true);
      expect(result.user?.nome).toBe("João");
    });

    it("deve retornar erro quando usuário não existe", async () => {
      mockedApi.get.mockRejectedValueOnce(new Error("Not found"));

      const result = await getUser(999);

      expect(result.success).toBe(false);
    });
  });

  // ==================== UPDATE USER ====================

  describe("updateUser", () => {
    it("deve atualizar nome do usuário com sucesso", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Dados atualizados com sucesso!",
          user: { id: 1, nome: "João Atualizado", email: "joao@email.com" },
        },
      };
      mockedApi.put.mockResolvedValueOnce(mockResponse);

      const result = await updateUser(1, { nome: "João Atualizado" });

      expect(mockedApi.put).toHaveBeenCalledWith("/users/1", {
        nome: "João Atualizado",
      });
      expect(result.success).toBe(true);
      expect(result.user?.nome).toBe("João Atualizado");
    });

    it("deve atualizar email do usuário com sucesso", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Dados atualizados com sucesso!",
          user: { id: 1, nome: "João", email: "novo@email.com" },
        },
      };
      mockedApi.put.mockResolvedValueOnce(mockResponse);

      const result = await updateUser(1, { email: "novo@email.com" });

      expect(result.success).toBe(true);
      expect(result.user?.email).toBe("novo@email.com");
    });

    it("deve retornar erro ao tentar usar email já existente", async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          data: {
            success: false,
            message: "Email já cadastrado: outro@email.com",
            user: null,
          },
        },
      };
      const error = Object.assign(new Error(), axiosError);
      mockedApi.put.mockRejectedValueOnce(error);

      const result = await updateUser(1, { email: "outro@email.com" });

      expect(result.success).toBe(false);
    });

    it("deve atualizar senha com sucesso", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Dados atualizados com sucesso!",
          user: { id: 1, nome: "João", email: "joao@email.com" },
        },
      };
      mockedApi.put.mockResolvedValueOnce(mockResponse);

      const result = await updateUser(1, { senha: "novasenha123" });

      expect(mockedApi.put).toHaveBeenCalledWith("/users/1", {
        senha: "novasenha123",
      });
      expect(result.success).toBe(true);
    });

    it("deve retornar erro de conexão quando servidor está fora", async () => {
      mockedApi.put.mockRejectedValueOnce(new Error("Network Error"));

      const result = await updateUser(1, { nome: "Teste" });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Não foi possível conectar ao servidor.");
    });
  });

  // ==================== DELETE USER ====================

  describe("deleteUser", () => {
    it("deve excluir conta com sucesso", async () => {
      const mockResponse = {
        data: {
          success: true,
          message: "Conta excluída com sucesso!",
          user: null,
        },
      };
      mockedApi.delete.mockResolvedValueOnce(mockResponse);

      const result = await deleteUser(1);

      expect(mockedApi.delete).toHaveBeenCalledWith("/users/1");
      expect(result.success).toBe(true);
      expect(result.message).toBe("Conta excluída com sucesso!");
    });

    it("deve retornar erro ao excluir usuário inexistente", async () => {
      mockedApi.delete.mockRejectedValueOnce(new Error("Not found"));

      const result = await deleteUser(999);

      expect(result.success).toBe(false);
    });

    it("deve retornar erro de conexão quando servidor está fora", async () => {
      mockedApi.delete.mockRejectedValueOnce(new Error("Network Error"));

      const result = await deleteUser(1);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Não foi possível conectar ao servidor.");
    });
  });
});
