import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@traineasy:user";

export interface StoredUser {
  id: number;
  nome: string;
  email: string;
}

export async function saveUser(user: StoredUser): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser(): Promise<StoredUser | null> {
  const data = await AsyncStorage.getItem(USER_KEY);
  if (!data) return null;
  return JSON.parse(data) as StoredUser;
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
