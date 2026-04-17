import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import { getHistorico, RegistroData } from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HistoricoDia {
  date: string;
  label: string;
  registros: RegistroData[];
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}`;
}

function formatDateFull(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export default function HistoricoScreen() {
  const router = useRouter();
  const [dias, setDias] = useState<HistoricoDia[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistorico();
    }, []),
  );

  async function loadHistorico() {
    const user = await getStoredUser();
    if (!user) return;

    setLoading(true);
    const response = await getHistorico(user.id);
    if (response.success) {
      const diasList: HistoricoDia[] = Object.entries(response.data).map(
        ([date, registros]) => ({
          date,
          label: `Treino - ${formatDate(date)}`,
          registros,
        }),
      );
      setDias(diasList);
    }
    setLoading(false);
  }

  function handleOpenDia(dia: HistoricoDia) {
    router.push({
      pathname: "/(tabs)/historico-detalhe",
      params: {
        date: dia.date,
        dateLabel: formatDateFull(dia.date),
        registros: JSON.stringify(dia.registros),
      },
    } as never);
  }

  function renderDiaItem({ item }: { item: HistoricoDia }) {
    const exerciciosUnicos = [
      ...new Set(item.registros.map((r) => r.exercicioNome)),
    ];

    return (
      <TouchableOpacity
        style={styles.diaCard}
        onPress={() => handleOpenDia(item)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="event" size={28} color={COLORS.primary} />
        <View style={styles.diaInfo}>
          <Text style={styles.diaLabel}>{item.label}</Text>
          <Text style={styles.diaSubtext}>
            {exerciciosUnicos.length} exercício
            {exerciciosUnicos.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.icon} />
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/home" as never)}
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Histórico de Treinos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View
        style={
          loading || dias.length === 0 ? styles.contentEmpty : styles.content
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : dias.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={64} color={COLORS.icon} />
            <Text style={styles.emptyText}>
              Nenhum treino registrado ainda.
            </Text>
            <Text style={styles.emptySubtext}>
              Registre séries nos seus treinos para vê-los aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={dias}
            keyExtractor={(item) => item.date}
            renderItem={renderDiaItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentEmpty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  diaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  diaInfo: {
    flex: 1,
  },
  diaLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  diaSubtext: {
    fontSize: 12,
    color: COLORS.icon,
  },
  emptyState: {
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.icon,
    textAlign: "center",
  },
});
