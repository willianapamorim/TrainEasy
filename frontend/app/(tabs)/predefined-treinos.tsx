import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import { createTreino } from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PREDEFINED_TREINOS = [
  {
    nome: "Treino ABC",
    desc: "Divisão em 3 dias — ideal para intermediários.",
  },
  {
    nome: "Treino ABCD",
    desc: "Divisão em 4 dias — maior volume por grupo muscular.",
  },
  {
    nome: "Treino ABCDE",
    desc: "Divisão em 5 dias — um grupo muscular por dia.",
  },
  {
    nome: "Push / Pull / Legs",
    desc: "Empurrar, puxar e pernas — 3 ou 6 dias por semana.",
  },
  {
    nome: "Upper / Lower",
    desc: "Superior e inferior — 4 dias por semana.",
  },
  {
    nome: "Full Body",
    desc: "Corpo inteiro — 2 a 3 dias por semana.",
  },
];

export default function PredefinedTreinosScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSelect(nome: string) {
    const user = await getStoredUser();
    if (!user) {
      router.replace("/(auth)/sign-in");
      return;
    }

    setSaving(true);
    const response = await createTreino({
      nome,
      tipo: "PREDEFINIDO",
      userId: user.id,
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Treinos Pré-definidos</Text>
        <View style={{ width: 24 }} />
      </View>

      {saving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Escolha uma divisão de treino para começar:
        </Text>

        {PREDEFINED_TREINOS.map((item) => (
          <TouchableOpacity
            key={item.nome}
            style={styles.card}
            onPress={() => handleSelect(item.nome)}
            disabled={saving}
          >
            <MaterialIcons
              name="fitness-center"
              size={28}
              color={COLORS.primary}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.icon} />
          </TouchableOpacity>
        ))}
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
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.icon,
    marginBottom: 24,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    gap: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.icon,
  },
});
