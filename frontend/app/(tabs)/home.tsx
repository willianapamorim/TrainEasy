import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import {
  deleteTreino,
  getTreinosByUser,
  TreinoData,
} from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [treinos, setTreinos] = useState<TreinoData[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadTreinos();
    }, []),
  );

  async function loadTreinos() {
    const user = await getStoredUser();
    if (!user) return;

    setLoading(true);
    const response = await getTreinosByUser(user.id);
    if (response.success && response.treinos) {
      setTreinos(response.treinos);
    }
    setLoading(false);
  }

  function handleDeleteTreino(treino: TreinoData) {
    Alert.alert(
      "Excluir Treino",
      `Deseja excluir "${treino.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const response = await deleteTreino(treino.id);
            if (response.success) {
              setTreinos((prev) => prev.filter((t) => t.id !== treino.id));
            } else {
              Alert.alert("Erro", response.message);
            }
          },
        },
      ],
    );
  }

  function renderTreinoItem({ item }: { item: TreinoData }) {
    return (
      <View style={styles.treinoCard}>
        <MaterialIcons
          name="fitness-center"
          size={28}
          color={COLORS.primary}
        />
        <View style={styles.treinoInfo}>
          <Text style={styles.treinoNome}>{item.nome}</Text>
          <Text style={styles.treinoTipo}>
            {item.tipo === "PREDEFINIDO" ? "Pré-definido" : "Personalizado"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteTreino(item)}
          hitSlop={10}
        >
          <MaterialIcons name="delete-outline" size={22} color={COLORS.icon} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meus Treinos</Text>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile" as never)}
          hitSlop={12}
        >
          <MaterialIcons name="edit" size={24} color={COLORS.iconEdit} />
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : treinos.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="fitness-center"
              size={64}
              color={COLORS.icon}
            />
            <Text style={styles.emptyText}>
              Você ainda não tem treinos cadastrados.
            </Text>
            <Text style={styles.emptySubtext}>
              Toque no "+" para adicionar seu primeiro treino.
            </Text>
          </View>
        ) : (
          <FlatList
            data={treinos}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderTreinoItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Bottom Menu */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.tabItem}>
          <MaterialIcons
            name="play-circle-outline"
            size={28}
            color={COLORS.icon}
          />
          <Text style={styles.tabLabel}>Vídeos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <MaterialIcons name="flag" size={28} color={COLORS.icon} />
          <Text style={styles.tabLabel}>Metas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <MaterialIcons name="calendar-today" size={28} color={COLORS.icon} />
          <Text style={styles.tabLabel}>Calendário</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push("/(tabs)/create-treino" as never)}
        >
          <MaterialIcons
            name="add-circle-outline"
            size={28}
            color={COLORS.icon}
          />
          <Text style={styles.tabLabel}>Novo</Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  treinoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  treinoInfo: {
    flex: 1,
  },
  treinoNome: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  treinoTipo: {
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
  bottomBar: {
    flexDirection: "row",
    backgroundColor: COLORS.darkCard,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.icon,
  },
});
