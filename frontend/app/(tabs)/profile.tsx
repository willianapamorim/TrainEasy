import { Button } from "@/src/components/Button";
import { Input } from "@/src/components/Input";
import { COLORS } from "@/src/constants/colors";
import {
  clearUser,
  getStoredUser,
  saveUser,
  StoredUser,
} from "@/src/services/storage";
import { deleteUser, updateUser } from "@/src/services/userService";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Campos de edição
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, []),
  );

  async function loadUser() {
    setLoading(true);
    const stored = await getStoredUser();
    if (stored) {
      setUser(stored);
      setNome(stored.nome);
      setEmail(stored.email);
    } else {
      router.replace("/(auth)/sign-in");
    }
    setLoading(false);
  }

  async function handleUpdate() {
    if (!user) return;

    if (!nome.trim() || !email.trim()) {
      Alert.alert("Erro", "Nome e e-mail são obrigatórios.");
      return;
    }

    setSaving(true);
    const payload: { nome?: string; email?: string; senha?: string } = {};

    if (nome !== user.nome) payload.nome = nome;
    if (email !== user.email) payload.email = email;
    if (senha.trim()) payload.senha = senha;

    if (Object.keys(payload).length === 0) {
      Alert.alert("Aviso", "Nenhuma alteração detectada.");
      setSaving(false);
      setEditing(false);
      return;
    }

    const response = await updateUser(user.id, payload);
    setSaving(false);

    if (response.success && response.user) {
      await saveUser(response.user);
      setUser(response.user);
      setSenha("");
      setEditing(false);
      Alert.alert("Sucesso", response.message);
    } else {
      Alert.alert("Erro", response.message);
    }
  }

  async function handleDelete() {
    if (!user) return;

    Alert.alert(
      "Excluir Conta",
      "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const response = await deleteUser(user.id);
            if (response.success) {
              await clearUser();
              Alert.alert("Sucesso", response.message, [
                {
                  text: "OK",
                  onPress: () => router.replace("/(auth)/sign-in"),
                },
              ]);
            } else {
              Alert.alert("Erro", response.message);
            }
          },
        },
      ],
    );
  }

  async function handleLogout() {
    await clearUser();
    router.replace("/(auth)/sign-in");
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
            <Text style={styles.brand}>Meu Perfil</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Saudação */}
          <Text style={styles.greeting}>Olá, {user?.nome}!</Text>
          <Text style={styles.subtitle}>Gerencie sua conta</Text>

          {/* Card de perfil */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Seus Dados</Text>

            {!editing ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Nome</Text>
                  <Text style={styles.value}>{user?.nome}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>E-mail</Text>
                  <Text style={styles.value}>{user?.email}</Text>
                </View>

                <Button title="Editar Dados" onPress={() => setEditing(true)} />
              </>
            ) : (
              <>
                <View style={styles.form}>
                  <Input
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                  />
                  <Input
                    placeholder="E-mail"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                  <Input
                    placeholder="Nova senha (opcional)"
                    secureTextEntry
                    value={senha}
                    onChangeText={setSenha}
                  />
                </View>

                <View style={styles.editButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setNome(user?.nome ?? "");
                      setEmail(user?.email ?? "");
                      setSenha("");
                      setEditing(false);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.saveButton, saving && styles.disabledButton]}
                    onPress={handleUpdate}
                    disabled={saving}
                  >
                    <Text style={styles.saveButtonText}>
                      {saving ? "Salvando..." : "Salvar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Zona de perigo */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Zona de Perigo</Text>
            <Text style={styles.dangerDescription}>
              Ao excluir sua conta, todos os seus dados serão removidos
              permanentemente.
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Excluir Conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  logoutText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.black,
    marginTop: 32,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 4,
  },
  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    backgroundColor: COLORS.grayLighter,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.black,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: "500",
  },
  form: {
    gap: 12,
    marginBottom: 16,
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  dangerZone: {
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: "#991B1B",
    lineHeight: 20,
    marginBottom: 16,
  },
  deleteButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
