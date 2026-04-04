import { ExercicioSelector } from "@/src/components/ExercicioSelector";
import { COLORS } from "@/src/constants/colors";
import {
  DivisaoData,
  getTreinoCompleto,
  TreinoCompletoData,
  updateDivisaoExercicios,
} from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TreinoDetailsScreen() {
  const router = useRouter();
  const { treinoId } = useLocalSearchParams<{ treinoId: string }>();
  const [treino, setTreino] = useState<TreinoCompletoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [editingDivisao, setEditingDivisao] = useState<DivisaoData | null>(
    null,
  );
  const [savingExercicios, setSavingExercicios] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadTreino();
    }, [treinoId]),
  );

  async function loadTreino() {
    if (!treinoId) return;
    setLoading(true);
    const response = await getTreinoCompleto(Number(treinoId));
    if (response.success && response.treino) {
      setTreino(response.treino);
    }
    setLoading(false);
  }

  function handleSelectDivisao(divisao: DivisaoData) {
    router.push({
      pathname: "/(tabs)/sessao-treino",
      params: {
        divisaoId: String(divisao.id),
        divisaoNome: divisao.nome,
        exercicios: JSON.stringify(divisao.exercicios),
      },
    } as never);
  }

  function handleEditDivisao(divisao: DivisaoData) {
    setEditingDivisao(divisao);
    setSelectorVisible(true);
  }

  async function handleExerciciosSelected(exercicios: string[]) {
    if (!editingDivisao) return;

    if (exercicios.length === 0) {
      Alert.alert("Aviso", "Selecione pelo menos um exercício.");
      return;
    }

    setSavingExercicios(true);
    const response = await updateDivisaoExercicios(
      editingDivisao.id,
      exercicios,
    );
    setSavingExercicios(false);

    if (response.success && response.treino) {
      setTreino(response.treino);
    } else {
      Alert.alert("Erro", response.message);
    }
    setEditingDivisao(null);
  }

  function renderDivisao({ item }: { item: DivisaoData }) {
    return (
      <TouchableOpacity
        style={styles.divisaoCard}
        onPress={() => handleSelectDivisao(item)}
      >
        <View style={styles.divisaoIcon}>
          <MaterialIcons
            name="fitness-center"
            size={28}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.divisaoInfo}>
          <Text style={styles.divisaoNome}>{item.nome}</Text>
          <Text style={styles.divisaoExercicios}>
            {item.exercicios.length} exercício(s)
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleEditDivisao(item)}
          hitSlop={10}
          style={styles.editBtn}
        >
          <MaterialIcons name="edit" size={20} color={COLORS.icon} />
        </TouchableOpacity>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.icon} />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {treino?.nome ?? "Detalhes do Treino"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : !treino || treino.divisoes.length === 0 ? (
        <View style={styles.centered}>
          <MaterialIcons name="info-outline" size={48} color={COLORS.icon} />
          <Text style={styles.emptyText}>
            Este treino não possui divisões cadastradas.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.subtitle}>
            Selecione a sessão de treino que deseja registrar:
          </Text>
          <FlatList
            data={treino.divisoes}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderDivisao}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      <ExercicioSelector
        visible={selectorVisible}
        onClose={() => {
          setSelectorVisible(false);
          setEditingDivisao(null);
        }}
        onConfirm={handleExerciciosSelected}
        selectedExercicios={
          editingDivisao ? editingDivisao.exercicios.map((e) => e.nome) : []
        }
      />

      {savingExercicios && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Atualizando exercícios...</Text>
        </View>
      )}
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
  subtitle: {
    fontSize: 15,
    color: COLORS.icon,
    textAlign: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.icon,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  divisaoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    gap: 14,
  },
  divisaoIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  divisaoInfo: {
    flex: 1,
  },
  divisaoNome: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  divisaoExercicios: {
    fontSize: 13,
    color: COLORS.icon,
  },
  editBtn: {
    padding: 6,
    marginRight: 4,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.white,
  },
});
