import { COLORS } from "@/src/constants/colors";
import {
  EXERCICIOS_CATALOGO,
  ExercicioCatalogo,
  GRUPOS_MUSCULARES,
} from "@/src/constants/exercicios";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ExercicioSelectorProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (exercicios: string[]) => void;
  selectedExercicios: string[];
}

export function ExercicioSelector({
  visible,
  onClose,
  onConfirm,
  selectedExercicios,
}: ExercicioSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedExercicios);
  const [grupoAtivo, setGrupoAtivo] = useState<string>(GRUPOS_MUSCULARES[0]);
  const [customExercicios, setCustomExercicios] = useState<ExercicioCatalogo[]>(
    [],
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoGrupo, setNovoGrupo] = useState("");

  useEffect(() => {
    if (visible) {
      setSelected(selectedExercicios);
      setShowCreateForm(false);
      setNovoNome("");
      setNovoGrupo("");
    }
  }, [visible]);

  function toggleExercicio(nome: string) {
    setSelected((prev) =>
      prev.includes(nome) ? prev.filter((e) => e !== nome) : [...prev, nome],
    );
  }

  function handleConfirm() {
    onConfirm(selected);
    onClose();
  }

  function handleCreateExercicio() {
    const nome = novoNome.trim();
    if (!nome) {
      Alert.alert("Aviso", "Digite o nome do exercício.");
      return;
    }
    if (!novoGrupo) {
      Alert.alert("Aviso", "Selecione a categoria do exercício.");
      return;
    }

    const allExercicios = [...EXERCICIOS_CATALOGO, ...customExercicios];
    if (
      allExercicios.some((e) => e.nome.toLowerCase() === nome.toLowerCase())
    ) {
      Alert.alert("Aviso", "Já existe um exercício com esse nome.");
      return;
    }

    const novo: ExercicioCatalogo = { nome, grupo: novoGrupo };
    setCustomExercicios((prev) => [...prev, novo]);
    setSelected((prev) => [...prev, nome]);
    setGrupoAtivo(novoGrupo);
    setShowCreateForm(false);
    setNovoNome("");
    setNovoGrupo("");
  }

  const todosExercicios = [...EXERCICIOS_CATALOGO, ...customExercicios];
  const exerciciosFiltrados = todosExercicios.filter(
    (e) => e.grupo === grupoAtivo,
  );

  function renderGrupoTab(grupo: string) {
    const isActive = grupo === grupoAtivo;
    return (
      <TouchableOpacity
        key={grupo}
        style={[styles.grupoTab, isActive && styles.grupoTabActive]}
        onPress={() => setGrupoAtivo(grupo)}
      >
        <Text
          style={[styles.grupoTabText, isActive && styles.grupoTabTextActive]}
        >
          {grupo}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderExercicio({ item }: { item: ExercicioCatalogo }) {
    const isSelected = selected.includes(item.nome);
    return (
      <TouchableOpacity
        style={[
          styles.exercicioItem,
          isSelected && styles.exercicioItemSelected,
        ]}
        onPress={() => toggleExercicio(item.nome)}
      >
        <MaterialIcons
          name={isSelected ? "check-box" : "check-box-outline-blank"}
          size={22}
          color={isSelected ? COLORS.primary : COLORS.icon}
        />
        <Text
          style={[
            styles.exercicioNome,
            isSelected && styles.exercicioNomeSelected,
          ]}
        >
          {item.nome}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <MaterialIcons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Selecionar Exercícios</Text>
          <TouchableOpacity onPress={handleConfirm} hitSlop={12}>
            <Text style={styles.confirmText}>OK ({selected.length})</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grupoTabs}>
          <FlatList
            data={[...GRUPOS_MUSCULARES]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => renderGrupoTab(item)}
            contentContainerStyle={styles.grupoTabsContent}
          />
        </View>

        {showCreateForm ? (
          <View style={styles.createForm}>
            <Text style={styles.createFormTitle}>Novo Exercício</Text>
            <TextInput
              style={styles.createInput}
              placeholder="Nome do exercício"
              placeholderTextColor={COLORS.icon}
              value={novoNome}
              onChangeText={setNovoNome}
              autoFocus
            />
            <Text style={styles.createLabel}>Categoria:</Text>
            <View style={styles.createGrupos}>
              {GRUPOS_MUSCULARES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.createGrupoChip,
                    novoGrupo === g && styles.createGrupoChipActive,
                  ]}
                  onPress={() => setNovoGrupo(g)}
                >
                  <Text
                    style={[
                      styles.createGrupoChipText,
                      novoGrupo === g && styles.createGrupoChipTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.createButtons}>
              <TouchableOpacity
                style={styles.createCancelBtn}
                onPress={() => {
                  setShowCreateForm(false);
                  setNovoNome("");
                  setNovoGrupo("");
                }}
              >
                <Text style={styles.createCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.createConfirmBtn}
                onPress={handleCreateExercicio}
              >
                <Text style={styles.createConfirmText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.createExercicioBtn}
            onPress={() => setShowCreateForm(true)}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.createExercicioBtnText}>
              Criar exercício personalizado
            </Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={exerciciosFiltrados}
          keyExtractor={(item) => item.nome}
          renderItem={renderExercicio}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
  grupoTabs: {
    paddingBottom: 8,
  },
  grupoTabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  grupoTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.darkCard,
  },
  grupoTabActive: {
    backgroundColor: COLORS.primary,
  },
  grupoTabText: {
    fontSize: 13,
    color: COLORS.icon,
    fontWeight: "600",
  },
  grupoTabTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  exercicioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.darkCard,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  exercicioItemSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  exercicioNome: {
    fontSize: 15,
    color: COLORS.white,
  },
  exercicioNomeSelected: {
    fontWeight: "700",
    color: COLORS.primary,
  },
  createExercicioBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createExercicioBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  createForm: {
    marginHorizontal: 20,
    backgroundColor: COLORS.darkCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  createFormTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 12,
  },
  createInput: {
    backgroundColor: COLORS.dark,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.white,
    marginBottom: 12,
  },
  createLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.icon,
    marginBottom: 8,
  },
  createGrupos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  createGrupoChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.dark,
  },
  createGrupoChipActive: {
    backgroundColor: COLORS.primary,
  },
  createGrupoChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.icon,
  },
  createGrupoChipTextActive: {
    color: COLORS.white,
  },
  createButtons: {
    flexDirection: "row",
    gap: 10,
  },
  createCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.icon,
    alignItems: "center",
  },
  createCancelText: {
    fontSize: 14,
    color: COLORS.icon,
    fontWeight: "600",
  },
  createConfirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: "center",
  },
  createConfirmText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "700",
  },
});
