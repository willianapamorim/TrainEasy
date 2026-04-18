import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import { RegistroData, updateRegistro } from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ExercicioGroup {
  exercicioNome: string;
  exercicioId: number;
  registros: RegistroData[];
}

export default function HistoricoDetalheScreen() {
  const router = useRouter();
  const { dateLabel, registros: registrosParam } = useLocalSearchParams<{
    date: string;
    dateLabel: string;
    registros: string;
  }>();

  const [registros, setRegistros] = useState<RegistroData[]>(
    registrosParam ? JSON.parse(registrosParam) : [],
  );
  const [expandedExercicio, setExpandedExercicio] = useState<number | null>(
    null,
  );
  const [editingRegistro, setEditingRegistro] = useState<number | null>(null);
  const [editCarga, setEditCarga] = useState("");
  const [editRepeticoes, setEditRepeticoes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const exercicioGroups: ExercicioGroup[] = useMemo(() => {
    const map = new Map<number, ExercicioGroup>();
    registros.forEach((reg) => {
      if (!map.has(reg.exercicioId)) {
        map.set(reg.exercicioId, {
          exercicioNome: reg.exercicioNome,
          exercicioId: reg.exercicioId,
          registros: [],
        });
      }
      map.get(reg.exercicioId)!.registros.push(reg);
    });
    // Sort series within each exercise
    map.forEach((group) => {
      group.registros.sort((a, b) => a.numeroSerie - b.numeroSerie);
    });
    return Array.from(map.values());
  }, [registros]);

  function toggleExercicio(exercicioId: number) {
    setExpandedExercicio(
      expandedExercicio === exercicioId ? null : exercicioId,
    );
    setEditingRegistro(null);
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

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Deseja realmente alterar as informações deste registro?",
      );
      if (confirmed) {
        confirmSaveEdit(reg, cargaNum, repNum);
      }
    } else {
      Alert.alert(
        "Confirmar edição",
        "Deseja realmente alterar as informações deste registro?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Confirmar",
            onPress: () => confirmSaveEdit(reg, cargaNum, repNum),
          },
        ],
      );
    }
  }

  async function confirmSaveEdit(
    reg: RegistroData,
    cargaNum: number,
    repNum: number,
  ) {
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
      // Update local state
      setRegistros((prev) =>
        prev.map((r) =>
          r.id === reg.id ? { ...r, carga: cargaNum, repeticoes: repNum } : r,
        ),
      );
    } else {
      Alert.alert("Erro", response.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          Treino - {dateLabel ?? ""}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Exercise list */}
      <ScrollView
        contentContainerStyle={styles.exerciciosList}
        showsVerticalScrollIndicator={false}
      >
        {exercicioGroups.map((group) => {
          const isActive = expandedExercicio === group.exercicioId;

          return (
            <View key={group.exercicioId}>
              <TouchableOpacity
                style={[
                  styles.exercicioCard,
                  styles.exercicioCardDone,
                  isActive && styles.exercicioCardActive,
                ]}
                onPress={() => toggleExercicio(group.exercicioId)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="fitness-center"
                  size={22}
                  color={COLORS.white}
                />
                <Text style={styles.exercicioNome}>{group.exercicioNome}</Text>
                <Text style={styles.seriesCount}>
                  {group.registros.length} série
                  {group.registros.length !== 1 ? "s" : ""}
                </Text>
                <MaterialIcons
                  name={isActive ? "expand-less" : "expand-more"}
                  size={22}
                  color={COLORS.white}
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>

              {isActive && (
                <View style={styles.expandedContent}>
                  <View style={styles.registrosSection}>
                    <View style={styles.registrosHeader}>
                      <Text style={styles.registrosSectionTitle}>
                        Séries registradas
                      </Text>
                      <View style={styles.editHint}>
                        <MaterialIcons
                          name="edit"
                          size={12}
                          color={COLORS.icon}
                        />
                        <Text style={styles.editHintText}>
                          toque para editar
                        </Text>
                      </View>
                    </View>
                    {group.registros.map((reg) => (
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
                              {savingEdit ? (
                                <ActivityIndicator
                                  size="small"
                                  color={COLORS.primary}
                                />
                              ) : (
                                <MaterialIcons
                                  name="check-circle"
                                  size={24}
                                  color={COLORS.primary}
                                />
                              )}
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
    flex: 1,
  },
  seriesCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
  },
  expandedContent: {
    backgroundColor: COLORS.darkCard,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 16,
  },
  registrosSection: {
    gap: 8,
  },
  registrosHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  registrosSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.icon,
  },
  editHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    opacity: 0.6,
  },
  editHintText: {
    fontSize: 11,
    color: COLORS.icon,
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
});
