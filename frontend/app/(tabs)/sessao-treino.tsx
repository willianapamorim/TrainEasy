import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import {
  ExercicioData,
  getRegistrosHoje,
  registrarExercicio,
  RegistroData,
  updateRegistro,
} from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SessaoTreinoScreen() {
  const router = useRouter();
  const { divisaoNome, exercicios: exerciciosParam } = useLocalSearchParams<{
    divisaoId: string;
    divisaoNome: string;
    exercicios: string;
  }>();

  const exercicios: ExercicioData[] = exerciciosParam
    ? JSON.parse(exerciciosParam)
    : [];

  const [selectedExercicio, setSelectedExercicio] =
    useState<ExercicioData | null>(null);
  const [registros, setRegistros] = useState<RegistroData[]>([]);
  const [registrosMap, setRegistrosMap] = useState<
    Record<number, RegistroData[]>
  >({});
  const [loadingRegistros, setLoadingRegistros] = useState(false);
  const [carga, setCarga] = useState("");
  const [repeticoes, setRepeticoes] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingRegistro, setEditingRegistro] = useState<number | null>(null);
  const [editCarga, setEditCarga] = useState("");
  const [editRepeticoes, setEditRepeticoes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Carrega registros de todos os exercícios ao montar
  useEffect(() => {
    async function loadAll() {
      const user = await getStoredUser();
      if (!user) return;
      const map: Record<number, RegistroData[]> = {};
      await Promise.all(
        exercicios.map(async (ex) => {
          const res = await getRegistrosHoje(ex.id, user.id);
          map[ex.id] = res.success && res.registros ? res.registros : [];
        }),
      );
      setRegistrosMap(map);
    }
    loadAll();
  }, []);

  async function handleSelectExercicio(exercicio: ExercicioData) {
    if (selectedExercicio?.id === exercicio.id) {
      setSelectedExercicio(null);
      setRegistros([]);
      return;
    }
    setSelectedExercicio(exercicio);
    await loadRegistros(exercicio.id);
  }

  async function loadRegistros(exercicioId: number) {
    const user = await getStoredUser();
    if (!user) return;

    setLoadingRegistros(true);
    const response = await getRegistrosHoje(exercicioId, user.id);
    const data =
      response.success && response.registros ? response.registros : [];
    setRegistros(data);
    setRegistrosMap((prev) => ({ ...prev, [exercicioId]: data }));
    setLoadingRegistros(false);
  }

  async function handleRegistrar() {
    if (!carga.trim() || !repeticoes.trim()) {
      Alert.alert("Aviso", "Preencha a carga e as repetições.");
      return;
    }

    const cargaNum = parseFloat(carga.replace(",", "."));
    const repNum = parseInt(repeticoes, 10);

    if (isNaN(cargaNum) || cargaNum <= 0) {
      Alert.alert("Aviso", "Informe uma carga válida.");
      return;
    }

    if (isNaN(repNum) || repNum <= 0) {
      Alert.alert("Aviso", "Informe um número válido de repetições.");
      return;
    }

    if (!selectedExercicio) return;

    const user = await getStoredUser();
    if (!user) return;

    const proximaSerie = registros.length + 1;

    setSaving(true);
    const response = await registrarExercicio({
      exercicioId: selectedExercicio.id,
      userId: user.id,
      carga: cargaNum,
      repeticoes: repNum,
      numeroSerie: proximaSerie,
    });
    setSaving(false);

    if (response.success) {
      setCarga("");
      setRepeticoes("");
      await loadRegistros(selectedExercicio.id);
    } else {
      Alert.alert("Erro", response.message);
    }
  }

  function startEditing(reg: RegistroData) {
    setEditingRegistro(reg.id);
    setEditCarga(String(reg.carga));
    setEditRepeticoes(String(reg.repeticoes));
  }

  async function handleSaveEdit(reg: RegistroData) {
    const cargaNum = parseFloat(editCarga.replace(",", "."));
    const repNum = parseInt(editRepeticoes, 10);

    if (isNaN(cargaNum) || cargaNum <= 0 || isNaN(repNum) || repNum <= 0) {
      Alert.alert("Aviso", "Informe valores válidos.");
      return;
    }

    const user = await getStoredUser();
    if (!user) return;

    setSavingEdit(true);
    const response = await updateRegistro(reg.id, {
      exercicioId: reg.exercicioId,
      userId: user.id,
      carga: cargaNum,
      repeticoes: repNum,
      numeroSerie: reg.numeroSerie,
    });
    setSavingEdit(false);

    if (response.success) {
      setEditingRegistro(null);
      if (selectedExercicio) {
        await loadRegistros(selectedExercicio.id);
      }
    } else {
      Alert.alert("Erro", response.message);
    }
  }

  function hasRegistros(exercicioId: number) {
    return (registrosMap[exercicioId]?.length ?? 0) > 0;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {divisaoNome ?? "Sessão de Treino"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista vertical de exercícios */}
      <ScrollView
        contentContainerStyle={styles.exerciciosList}
        showsVerticalScrollIndicator={false}
      >
        {exercicios.map((item) => {
          const isActive = selectedExercicio?.id === item.id;
          const done = hasRegistros(item.id);

          return (
            <View key={item.id}>
              <TouchableOpacity
                style={[
                  styles.exercicioCard,
                  done && styles.exercicioCardDone,
                  isActive && styles.exercicioCardActive,
                ]}
                onPress={() => handleSelectExercicio(item)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="fitness-center"
                  size={22}
                  color={
                    isActive ? COLORS.white : done ? "#fff" : COLORS.primary
                  }
                />
                <Text
                  style={[
                    styles.exercicioNome,
                    isActive && styles.exercicioNomeActive,
                  ]}
                >
                  {item.nome}
                </Text>
                <MaterialIcons
                  name={isActive ? "expand-less" : "expand-more"}
                  size={22}
                  color={COLORS.white}
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>

              {/* Conteúdo expandido do exercício */}
              {isActive && (
                <View style={styles.expandedContent}>
                  {/* Placeholder de imagem */}
                  <View style={styles.imagePlaceholder}>
                    <MaterialIcons name="image" size={48} color={COLORS.icon} />
                    <Text style={styles.imagePlaceholderText}>
                      Imagem do exercício
                    </Text>
                  </View>

                  {/* Formulário inline para registrar série */}
                  <View style={styles.registroForm}>
                    <Text style={styles.registroFormTitle}>
                      Registrar Série {registros.length + 1}
                    </Text>

                    <View style={styles.inputRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Carga (kg)</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex.: 20"
                          placeholderTextColor={COLORS.icon}
                          value={carga}
                          onChangeText={setCarga}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Repetições</Text>
                        <TextInput
                          style={styles.input}
                          placeholder="Ex.: 12"
                          placeholderTextColor={COLORS.icon}
                          value={repeticoes}
                          onChangeText={setRepeticoes}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.registrarBtn,
                        saving && styles.buttonDisabled,
                      ]}
                      onPress={handleRegistrar}
                      disabled={saving}
                    >
                      {saving ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                      ) : (
                        <>
                          <MaterialIcons
                            name="check"
                            size={18}
                            color={COLORS.white}
                          />
                          <Text style={styles.registrarBtnText}>
                            Registrar Série
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Séries registradas */}
                  {loadingRegistros ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primary}
                      style={{ marginVertical: 12 }}
                    />
                  ) : registros.length > 0 ? (
                    <View style={styles.registrosSection}>
                      <Text style={styles.registrosSectionTitle}>
                        Séries registradas
                      </Text>
                      {registros.map((reg) => (
                        <View key={reg.id} style={styles.registroRow}>
                          <View style={styles.serieCircle}>
                            <Text style={styles.serieText}>
                              {reg.numeroSerie}
                            </Text>
                          </View>
                          {editingRegistro === reg.id ? (
                            <>
                              <View style={styles.registroInfo}>
                                <Text style={styles.registroLabel}>Carga</Text>
                                <TextInput
                                  style={styles.editInput}
                                  value={editCarga}
                                  onChangeText={setEditCarga}
                                  keyboardType="decimal-pad"
                                  autoFocus
                                />
                              </View>
                              <View style={styles.registroInfo}>
                                <Text style={styles.registroLabel}>Reps</Text>
                                <TextInput
                                  style={styles.editInput}
                                  value={editRepeticoes}
                                  onChangeText={setEditRepeticoes}
                                  keyboardType="number-pad"
                                />
                              </View>
                              <TouchableOpacity
                                onPress={() => handleSaveEdit(reg)}
                                disabled={savingEdit}
                                hitSlop={8}
                              >
                                <MaterialIcons
                                  name="check-circle"
                                  size={24}
                                  color={COLORS.primary}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => setEditingRegistro(null)}
                                hitSlop={8}
                              >
                                <MaterialIcons
                                  name="cancel"
                                  size={24}
                                  color={COLORS.icon}
                                />
                              </TouchableOpacity>
                            </>
                          ) : (
                            <>
                              <TouchableOpacity
                                style={styles.registroInfo}
                                onPress={() => startEditing(reg)}
                              >
                                <Text style={styles.registroLabel}>Carga</Text>
                                <Text style={styles.registroValueEditable}>
                                  {reg.carga} kg
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.registroInfo}
                                onPress={() => startEditing(reg)}
                              >
                                <Text style={styles.registroLabel}>Reps</Text>
                                <Text style={styles.registroValueEditable}>
                                  {reg.repeticoes}
                                </Text>
                              </TouchableOpacity>
                            </>
                          )}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noSeriesText}>
                      Nenhuma série registrada ainda.
                    </Text>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
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
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  exerciciosList: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 10,
  },
  exercicioCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.darkCard,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exercicioCardDone: {
    backgroundColor: "#2e7d32",
  },
  exercicioCardActive: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  exercicioNome: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.white,
  },
  exercicioNomeActive: {
    color: COLORS.white,
  },
  expandedContent: {
    backgroundColor: COLORS.darkCard,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: COLORS.dark,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  imagePlaceholderText: {
    fontSize: 13,
    color: COLORS.icon,
    marginTop: 6,
  },
  registroForm: {
    marginBottom: 12,
  },
  registroFormTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.icon,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.white,
  },
  registrarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  registrarBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  registrosSection: {
    marginTop: 4,
    gap: 8,
  },
  registrosSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.icon,
    marginBottom: 4,
  },
  registroRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    padding: 12,
    gap: 14,
  },
  serieCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  serieText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  registroInfo: {
    alignItems: "center",
    flex: 1,
  },
  registroLabel: {
    fontSize: 11,
    color: COLORS.icon,
    marginBottom: 2,
  },
  registroValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  registroValueEditable: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    borderStyle: "dashed",
    paddingBottom: 2,
  },
  editInput: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: "center",
    minWidth: 50,
  },
  noSeriesText: {
    fontSize: 13,
    color: COLORS.icon,
    textAlign: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
