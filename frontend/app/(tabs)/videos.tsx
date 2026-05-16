import { COLORS } from "@/src/constants/colors";
import {
  CategoriaVideo,
  getCategorias,
} from "@/src/services/videoService";
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

/** Ícone representativo para cada categoria de exercício */
const CATEGORIA_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Abdômen: "accessibility-new",
  Antebraço: "fitness-center",
  Bíceps: "fitness-center",
  Costas: "accessibility-new",
  Ombro: "accessibility-new",
  Peitoral: "fitness-center",
  Pernas: "directions-walk",
  Tríceps: "fitness-center",
};

function getIconForCategoria(nome: string): keyof typeof MaterialIcons.glyphMap {
  return CATEGORIA_ICONS[nome] ?? "play-circle-outline";
}

export default function VideosScreen() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<CategoriaVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadCategorias();
    }, []),
  );

  async function loadCategorias() {
    setLoading(true);
    const response = await getCategorias();
    if (response.success && response.categorias) {
      setCategorias(response.categorias);
    }
    setLoading(false);
  }

  function handleOpenCategoria(categoria: CategoriaVideo) {
    router.push({
      pathname: "/(tabs)/video-categoria",
      params: { categoria: categoria.nome },
    } as never);
  }

  function renderCategoriaItem({ item }: { item: CategoriaVideo }) {
    return (
      <TouchableOpacity
        style={styles.categoriaCard}
        onPress={() => handleOpenCategoria(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={getIconForCategoria(item.nome)}
            size={28}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.categoriaInfo}>
          <Text style={styles.categoriaNome}>{item.nome}</Text>
          <Text style={styles.categoriaCount}>
            {item.quantidadeVideos}{" "}
            {item.quantidadeVideos === 1 ? "vídeo" : "vídeos"}
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
        <Text style={styles.title}>Vídeos de Exercícios</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View
        style={
          loading || categorias.length === 0
            ? styles.contentEmpty
            : styles.content
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : categorias.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="videocam-off"
              size={64}
              color={COLORS.icon}
            />
            <Text style={styles.emptyText}>
              Nenhuma categoria de vídeo disponível.
            </Text>
            <Text style={styles.emptySubtext}>
              Os vídeos de demonstração serão adicionados em breve.
            </Text>
          </View>
        ) : (
          <FlatList
            data={categorias}
            keyExtractor={(item) => item.nome}
            renderItem={renderCategoriaItem}
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
  categoriaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(124, 58, 237, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoriaInfo: {
    flex: 1,
  },
  categoriaNome: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  categoriaCount: {
    fontSize: 13,
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
