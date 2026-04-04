import { COLORS } from "@/src/constants/colors";
import { getStoredUser } from "@/src/services/storage";
import { createTreinoCompleto } from "@/src/services/treinoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PredefinedDivisao {
  nome: string;
  exercicios: string[];
}

interface PredefinedTreino {
  nome: string;
  desc: string;
  divisoes: PredefinedDivisao[];
}

const PREDEFINED_TREINOS: PredefinedTreino[] = [
  {
    nome: "Treino ABC",
    desc: "Divisão em 3 dias — ideal para intermediários.",
    divisoes: [
      {
        nome: "Treino A - Peito/Tríceps",
        exercicios: [
          "Supino Reto",
          "Supino Inclinado",
          "Crucifixo",
          "Crossover",
          "Tríceps Pulley",
          "Tríceps Testa",
        ],
      },
      {
        nome: "Treino B - Costas/Bíceps",
        exercicios: [
          "Puxada Frontal",
          "Remada Curvada",
          "Remada Baixa",
          "Pulldown",
          "Rosca Direta",
          "Rosca Martelo",
        ],
      },
      {
        nome: "Treino C - Pernas/Ombros",
        exercicios: [
          "Agachamento Livre",
          "Leg Press",
          "Cadeira Extensora",
          "Mesa Flexora",
          "Elevação Lateral",
          "Desenvolvimento com Halteres",
        ],
      },
    ],
  },
  {
    nome: "Treino ABCD",
    desc: "Divisão em 4 dias — maior volume por grupo muscular.",
    divisoes: [
      {
        nome: "Treino A - Peito",
        exercicios: [
          "Supino Reto",
          "Supino Inclinado",
          "Supino Declinado",
          "Crucifixo",
          "Crossover",
        ],
      },
      {
        nome: "Treino B - Costas",
        exercicios: [
          "Puxada Frontal",
          "Remada Curvada",
          "Remada Unilateral",
          "Remada Baixa",
          "Barra Fixa",
        ],
      },
      {
        nome: "Treino C - Pernas",
        exercicios: [
          "Agachamento Livre",
          "Leg Press",
          "Cadeira Extensora",
          "Mesa Flexora",
          "Panturrilha em Pé",
        ],
      },
      {
        nome: "Treino D - Ombros/Braços",
        exercicios: [
          "Desenvolvimento Militar",
          "Elevação Lateral",
          "Rosca Direta",
          "Rosca Martelo",
          "Tríceps Pulley",
          "Tríceps Francês",
        ],
      },
    ],
  },
  {
    nome: "Treino ABCDE",
    desc: "Divisão em 5 dias — um grupo muscular por dia.",
    divisoes: [
      {
        nome: "Treino A - Peito",
        exercicios: [
          "Supino Reto",
          "Supino Inclinado",
          "Crucifixo",
          "Crossover",
          "Fly na Máquina",
        ],
      },
      {
        nome: "Treino B - Costas",
        exercicios: [
          "Puxada Frontal",
          "Remada Curvada",
          "Remada Baixa",
          "Pulldown",
          "Barra Fixa",
        ],
      },
      {
        nome: "Treino C - Ombros",
        exercicios: [
          "Desenvolvimento Militar",
          "Elevação Lateral",
          "Elevação Frontal",
          "Crucifixo Inverso",
          "Encolhimento",
        ],
      },
      {
        nome: "Treino D - Braços",
        exercicios: [
          "Rosca Direta",
          "Rosca Martelo",
          "Rosca Scott",
          "Tríceps Pulley",
          "Tríceps Testa",
          "Mergulho",
        ],
      },
      {
        nome: "Treino E - Pernas",
        exercicios: [
          "Agachamento Livre",
          "Leg Press",
          "Cadeira Extensora",
          "Mesa Flexora",
          "Stiff",
          "Panturrilha em Pé",
        ],
      },
    ],
  },
  {
    nome: "Push / Pull / Legs",
    desc: "Empurrar, puxar e pernas — 3 ou 6 dias por semana.",
    divisoes: [
      {
        nome: "Push - Empurrar",
        exercicios: [
          "Supino Reto",
          "Supino Inclinado",
          "Desenvolvimento Militar",
          "Elevação Lateral",
          "Tríceps Pulley",
        ],
      },
      {
        nome: "Pull - Puxar",
        exercicios: [
          "Puxada Frontal",
          "Remada Curvada",
          "Remada Baixa",
          "Rosca Direta",
          "Rosca Martelo",
        ],
      },
      {
        nome: "Legs - Pernas",
        exercicios: [
          "Agachamento Livre",
          "Leg Press",
          "Cadeira Extensora",
          "Mesa Flexora",
          "Panturrilha em Pé",
        ],
      },
    ],
  },
  {
    nome: "Upper / Lower",
    desc: "Superior e inferior — 4 dias por semana.",
    divisoes: [
      {
        nome: "Upper - Superior",
        exercicios: [
          "Supino Reto",
          "Puxada Frontal",
          "Desenvolvimento Militar",
          "Rosca Direta",
          "Tríceps Pulley",
        ],
      },
      {
        nome: "Lower - Inferior",
        exercicios: [
          "Agachamento Livre",
          "Leg Press",
          "Cadeira Extensora",
          "Mesa Flexora",
          "Panturrilha em Pé",
        ],
      },
    ],
  },
  {
    nome: "Full Body",
    desc: "Corpo inteiro — 2 a 3 dias por semana.",
    divisoes: [
      {
        nome: "Full Body",
        exercicios: [
          "Agachamento Livre",
          "Supino Reto",
          "Puxada Frontal",
          "Desenvolvimento Militar",
          "Rosca Direta",
          "Tríceps Pulley",
          "Abdominal Crunch",
        ],
      },
    ],
  },
];

export default function PredefinedTreinosScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSelect(treino: PredefinedTreino) {
    const user = await getStoredUser();
    if (!user) {
      router.replace("/(auth)/sign-in");
      return;
    }

    setSaving(true);
    const response = await createTreinoCompleto({
      nome: treino.nome,
      tipo: "PREDEFINIDO",
      userId: user.id,
      divisoes: treino.divisoes.map((d) => ({
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
            onPress={() => handleSelect(item)}
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
              <Text style={styles.cardDivisoes}>
                {item.divisoes.length} divisão(ões)
              </Text>
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
  cardDivisoes: {
    fontSize: 11,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "600",
  },
});
