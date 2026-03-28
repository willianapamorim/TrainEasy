import { COLORS } from "@/src/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

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
        <View style={styles.emptyState}>
          <MaterialIcons name="fitness-center" size={64} color={COLORS.icon} />
          <Text style={styles.emptyText}>
            Você ainda não tem treinos cadastrados.
          </Text>
          <Text style={styles.emptySubtext}>
            Toque no "+" para adicionar seu primeiro treino.
          </Text>
        </View>
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

        <TouchableOpacity style={styles.tabItem}>
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
