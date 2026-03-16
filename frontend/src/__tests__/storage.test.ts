import { clearUser, getStoredUser, saveUser } from "@/src/services/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

describe("storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = { id: 1, nome: "João", email: "joao@email.com" };

  describe("saveUser", () => {
    it("deve salvar dados do usuário no AsyncStorage", async () => {
      await saveUser(mockUser);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@traineasy:user",
        JSON.stringify(mockUser),
      );
    });
  });

  describe("getStoredUser", () => {
    it("deve retornar dados do usuário quando existem", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockUser),
      );

      const result = await getStoredUser();

      expect(AsyncStorage.getItem).toHaveBeenCalledWith("@traineasy:user");
      expect(result).toEqual(mockUser);
    });

    it("deve retornar null quando não há dados salvos", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await getStoredUser();

      expect(result).toBeNull();
    });
  });

  describe("clearUser", () => {
    it("deve remover dados do usuário do AsyncStorage", async () => {
      await clearUser();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@traineasy:user");
    });
  });
});
