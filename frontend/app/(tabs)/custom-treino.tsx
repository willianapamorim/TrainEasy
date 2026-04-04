import { ExercicioSelector } from "@/src/components/ExercicioSelector";
import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import { createTreinoCompleto } from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Divisao {
  nome: string;
  exercicios: string[];
}

export default function CustomTreinoScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [divisoes, setDivisoes] = useState<Divisao[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [editingDivisaoIndex, setEditingDivisaoIndex] = useState<number>(-1);

  function handleAddDivisao() {
    const letra = String.fromCharCode(65 + divisoes.length);
    setDivisoes((prev) => [
      ...prev,
      { nome: `Treino ${letra}`, exercicios: [] },
    ]);
  }

  function handleRemoveDivisao(index: number) {
    setDivisoes((prev) => prev.filter((_, i) => i !== index));
  }

  function handleEditDivisaoNome(index: number, novoNome: string) {
    setDivisoes((prev) =>
      prev.map((d, i) => (i === index ? { ...d, nome: novoNome } : d)),
    );
  }

  function openExercicioSelector(index: number) {
    setEditingDivisaoIndex(index);
    setSelectorVisible(true);
  }

  function handleExerciciosSelected(exercicios: string[]) {
    setDivisoes((prev) =>
      prev.map((d, i) =>
        i === editingDivisaoIndex ? { ...d, exercicios } : d,
      ),
    );
  }

  async function handleCreate() {
    if (!nome.trim()) {
      Alert.alert("Aviso", "Digite um nome para o seu treino.");
      return;
    }

    if (divisoes.length === 0) {
      Alert.alert("Aviso", "Adicione pelo menos uma divisão de treino.");
      return;
    }

    const divisaoSemExercicio = divisoes.find((d) => d.exercicios.length === 0);
    if (divisaoSemExercicio) {
      Alert.alert(
        "Aviso",
        `A divisão "${divisaoSemExercicio.nome}" não tem exercícios. Adicione pelo menos um.`,
      );
      return;
    }

    const user = await getStoredUser();
    if (!user) {
      router.replace("/(auth)/sign-in");
      return;
    }

    setSaving(true);
    const response = await createTreinoCompleto({
      nome: nome.trim(),
      tipo: "PERSONALIZADO",
      userId: user.id,
      divisoes: divisoes.map((d) => ({
        nome: d.nome,
        exercicios: d.exercicios,
      })),
    });
    setSaving(false);

    if (response.success) {
      if (Platform.OS === "web") {
        window.alert("Treino criado com sucesso!");
        router.replace("/(tabs)/home" as never);
      } else {
        Alert.alert("Sucesso", "Treino criado com sucesso!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home" as never),
          },
        ]);
      }
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome do Treino */}
          <Text style={styles.label}>Nome do Treino</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Meu Treino de Hipertrofia"
            placeholderTextColor={COLORS.icon}
            value={nome}
            onChangeText={setNome}
            maxLength={100}
          />

          {/* Divisões */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Divisões de Treino</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddDivisao}
            >
              <MaterialIcons name="add" size={20} color={COLORS.white} />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          {divisoes.length === 0 && (
            <Text style={styles.emptyText}>
              Nenhuma divisão adicionada. Toque em "Adicionar" para criar
              divisões como Treino A, Treino B, etc.
            </Text>
          )}

          {divisoes.map((divisao, index) => (
            <View key={index} style={styles.divisaoCard}>
              <View style={styles.divisaoHeader}>
                <TextInput
                  style={styles.divisaoNomeInput}
                  value={divisao.nome}
                  onChangeText={(text) => handleEditDivisaoNome(index, text)}
                  maxLength={50}
                />
                <TouchableOpacity
                  onPress={() => handleRemoveDivisao(index)}
                  hitSlop={8}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={20}
                    color={COLORS.icon}
                  />
                </TouchableOpacity>
              </View>

              {divisao.exercicios.length > 0 && (
                <View style={styles.exerciciosList}>
                  {divisao.exercicios.map((ex, exIndex) => (
                    <View key={exIndex} style={styles.exercicioChip}>
                      <Text style={styles.exercicioChipText}>{ex}</Text>
                    </View>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.selectExerciciosBtn}
                onPress={() => openExercicioSelector(index)}
              >
                <MaterialIcons
                  name="fitness-center"
                  size={18}
                  color={COLORS.primary}
                />
                <Text style={styles.selectExerciciosBtnText}>
                  {divisao.exercicios.length > 0
                    ? `Editar Exercícios (${divisao.exercicios.length})`
                    : "Selecionar Exercícios"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Botão Criar */}
          <TouchableOpacity
            style={[styles.createButton, saving && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.createButtonText}>Criar Treino</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Modal de seleção de exercícios */}
        {editingDivisaoIndex >= 0 && (
          <ExercicioSelector
            visible={selectorVisible}
            onClose={() => setSelectorVisible(false)}
            onConfirm={handleExerciciosSelected}
            selectedExercicios={divisoes[editingDivisaoIndex]?.exercicios ?? []}
          />
        )}
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    color: COLORS.icon,
    marginBottom: 8,
    fontWeight: "600",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.icon,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  divisaoCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  divisaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  divisaoNomeInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginRight: 12,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.icon,
  },
  exerciciosList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  exercicioChip: {
    backgroundColor: "rgba(124, 58, 237, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  exercicioChipText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  selectExerciciosBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  selectExerciciosBtnText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
});
