import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import { createTreino } from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomTreinoScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!nome.trim()) {
      Alert.alert("Aviso", "Digite um nome para o seu treino.");
      return;
    }

    const user = await getStoredUser();
    if (!user) {
      router.replace("/(auth)/sign-in");
      return;
    }

    setSaving(true);
    const response = await createTreino({
      nome: nome.trim(),
      tipo: "PERSONALIZADO",
      userId: user.id,
    });
    setSaving(false);

    if (response.success) {
      Alert.alert("Sucesso", "Treino criado com sucesso!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home" as never) },
      ]);
    } else {
      Alert.alert("Erro", response.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Treino Personalizado</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Formulário */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Dê um nome para o seu programa de treino:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex.: Meu Treino de Hipertrofia"
            placeholderTextColor={COLORS.icon}
            value={nome}
            onChangeText={setNome}
            maxLength={100}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, saving && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Criar Treino</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.icon,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});
