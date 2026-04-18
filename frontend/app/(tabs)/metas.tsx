import { COLORS } from "@/src/constants/colors";
import {
  atualizarMeta,
  criarMeta,
  excluirMeta,
  listarMetas,
  MetaData,
} from "@/src/services/metaService";
import { getStoredUser } from "@/src/services/storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---- Animated MetaItem component ---- */
function MetaItem({
  item,
  isCompleting,
  onCompletionDone,
  onToggle,
  onEdit,
  onDelete,
  formatDate,
}: {
  item: MetaData;
  isCompleting: boolean;
  onCompletionDone: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (d: string) => string;
}) {
  const overlayWidth = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (isCompleting) {
      setShowOverlay(true);
      overlayWidth.setValue(0);
      overlayOpacity.setValue(0);
      textOpacity.setValue(0);

      Animated.sequence([
        // 1. Green bar sweeps from left to right
        Animated.parallel([
          Animated.timing(overlayWidth, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
          }),
          Animated.timing(overlayOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]),
        // 2. "Concluído!" text fades in
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
        // 3. Hold visible
        Animated.delay(900),
        // 4. Fade everything out
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setShowOverlay(false);
        onCompletionDone();
      });
    }
  }, [isCompleting]);

  return (
    <View style={styles.metaCard}>
      <TouchableOpacity style={styles.checkArea} onPress={onToggle} hitSlop={8}>
        <MaterialIcons
          name={item.concluida ? "check-circle" : "radio-button-unchecked"}
          size={26}
          color={item.concluida ? "#2e7d32" : COLORS.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.metaContent}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.metaTitulo, item.concluida && styles.metaConcluida]}
        >
          {item.titulo}
        </Text>
        {item.descricao ? (
          <Text style={styles.metaDescricao} numberOfLines={2}>
            {item.descricao}
          </Text>
        ) : null}
        <Text style={styles.metaData}>
          Criada em {formatDate(item.createdAt)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDelete} hitSlop={10}>
        <MaterialIcons name="delete-outline" size={22} color={COLORS.icon} />
      </TouchableOpacity>

      {/* Green completion overlay */}
      {showOverlay && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.completionOverlay,
            {
              width: overlayWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
              opacity: overlayOpacity,
            },
          ]}
        >
          <Animated.View
            style={[styles.completionTextWrap, { opacity: textOpacity }]}
          >
            <MaterialIcons name="check-circle" size={22} color="#fff" />
            <Text style={styles.completionText}>Concluído!</Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

export default function MetasScreen() {
  const router = useRouter();
  const [metas, setMetas] = useState<MetaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeta, setEditingMeta] = useState<MetaData | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadMetas();
    }, []),
  );

  async function loadMetas() {
    const user = await getStoredUser();
    if (!user) return;

    setLoading(true);
    const response = await listarMetas(user.id);
    if (response.success && response.metas) {
      setMetas(response.metas);
    }
    setLoading(false);
  }

  function openCreateModal() {
    setEditingMeta(null);
    setTitulo("");
    setDescricao("");
    setModalVisible(true);
  }

  function openEditModal(meta: MetaData) {
    setEditingMeta(meta);
    setTitulo(meta.titulo);
    setDescricao(meta.descricao ?? "");
    setModalVisible(true);
  }

  async function handleSave() {
    if (!titulo.trim()) {
      if (Platform.OS === "web") {
        window.alert("Informe o título da meta.");
      } else {
        Alert.alert("Aviso", "Informe o título da meta.");
      }
      return;
    }

    const user = await getStoredUser();
    if (!user) return;

    setSaving(true);

    if (editingMeta) {
      const response = await atualizarMeta(editingMeta.id, {
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        userId: user.id,
      });
      if (response.success) {
        setModalVisible(false);
        await loadMetas();
      } else {
        if (Platform.OS === "web") {
          window.alert(response.message);
        } else {
          Alert.alert("Erro", response.message);
        }
      }
    } else {
      const response = await criarMeta({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        userId: user.id,
      });
      if (response.success) {
        setModalVisible(false);
        await loadMetas();
      } else {
        if (Platform.OS === "web") {
          window.alert(response.message);
        } else {
          Alert.alert("Erro", response.message);
        }
      }
    }

    setSaving(false);
  }

  async function handleToggleConcluida(meta: MetaData) {
    const user = await getStoredUser();
    if (!user) return;

    const response = await atualizarMeta(meta.id, {
      titulo: meta.titulo,
      concluida: !meta.concluida,
      userId: user.id,
    });
    if (response.success) {
      const wasCompleting = !meta.concluida;
      setMetas((prev) =>
        prev.map((m) =>
          m.id === meta.id ? { ...m, concluida: !m.concluida } : m,
        ),
      );
      if (wasCompleting) {
        setCompletingId(meta.id);
      }
    }
  }

  async function performDelete(meta: MetaData) {
    const response = await excluirMeta(meta.id);
    if (response.success) {
      setMetas((prev) => prev.filter((m) => m.id !== meta.id));
    } else {
      if (Platform.OS === "web") {
        window.alert(response.message);
      } else {
        Alert.alert("Erro", response.message);
      }
    }
  }

  function handleDelete(meta: MetaData) {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Deseja excluir a meta "${meta.titulo}"?`,
      );
      if (confirmed) performDelete(meta);
    } else {
      Alert.alert("Excluir Meta", `Deseja excluir "${meta.titulo}"?`, [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => performDelete(meta),
        },
      ]);
    }
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const metasPendentes = metas.filter((m) => !m.concluida);
  const metasConcluidas = metas.filter((m) => m.concluida);

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
        <Text style={styles.title}>Minhas Metas</Text>
        <TouchableOpacity onPress={openCreateModal} hitSlop={12}>
          <MaterialIcons name="add" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View
        style={
          loading || metas.length === 0 ? styles.contentEmpty : styles.content
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : metas.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="flag" size={64} color={COLORS.icon} />
            <Text style={styles.emptyText}>Nenhuma meta cadastrada.</Text>
            <Text style={styles.emptySubtext}>
              Toque no "+" para definir sua primeira meta.
            </Text>
          </View>
        ) : (
          <FlatList
            data={[...metasPendentes, ...metasConcluidas]}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <>
                {index === 0 && metasPendentes.length > 0 && (
                  <Text style={styles.sectionTitle}>Pendentes</Text>
                )}
                {index === metasPendentes.length &&
                  metasConcluidas.length > 0 && (
                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
                      Concluídas
                    </Text>
                  )}
                <MetaItem
                  item={item}
                  isCompleting={completingId === item.id}
                  onCompletionDone={() => setCompletingId(null)}
                  onToggle={() => handleToggleConcluida(item)}
                  onEdit={() => openEditModal(item)}
                  onDelete={() => handleDelete(item)}
                  formatDate={formatDate}
                />
              </>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
        {/* Show "Concluídas" section header inline */}
      </View>

      {/* Modal for create/edit */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingMeta ? "Editar Meta" : "Nova Meta"}
            </Text>

            <Text style={styles.inputLabel}>Título *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Ganhar 5kg de massa muscular"
              placeholderTextColor={COLORS.icon}
              value={titulo}
              onChangeText={setTitulo}
              maxLength={100}
              autoFocus
            />

            <Text style={styles.inputLabel}>Descrição (opcional)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Descreva detalhes sobre sua meta..."
              placeholderTextColor={COLORS.icon}
              value={descricao}
              onChangeText={setDescricao}
              maxLength={500}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {editingMeta ? "Salvar" : "Cadastrar"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    overflow: "hidden",
    position: "relative" as const,
  },
  checkArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  metaContent: {
    flex: 1,
  },
  metaTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 2,
  },
  metaConcluida: {
    textDecorationLine: "line-through",
    color: COLORS.icon,
  },
  metaDescricao: {
    fontSize: 13,
    color: COLORS.icon,
    marginBottom: 4,
  },
  metaData: {
    fontSize: 11,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 420,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.icon,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 16,
  },
  inputMultiline: {
    minHeight: 90,
    paddingTop: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.icon,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.icon,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  completionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(27, 94, 32, 0.82)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  completionTextWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  completionText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
});
