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

export default function CreateTreinoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Novo Treino</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Opções */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Como deseja criar seu programa de treino?
        </Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() =>
            router.push("/(tabs)/predefined-treinos" as never)
          }
        >
          <MaterialIcons
            name="list-alt"
            size={40}
            color={COLORS.primary}
          />
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Treino Pré-definido</Text>
            <Text style={styles.optionDesc}>
              Escolha entre divisões de treino prontas para usar.
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={28}
            color={COLORS.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() =>
            router.push("/(tabs)/custom-treino" as never)
          }
        >
          <MaterialIcons
            name="edit-note"
            size={40}
            color={COLORS.primary}
          />
          <View style={styles.optionInfo}>
            <Text style={styles.optionTitle}>Treino Personalizado</Text>
            <Text style={styles.optionDesc}>
              Crie um programa com o nome que preferir.
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={28}
            color={COLORS.icon}
          />
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
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.icon,
    marginBottom: 32,
    textAlign: "center",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
    color: COLORS.icon,
  },
});
