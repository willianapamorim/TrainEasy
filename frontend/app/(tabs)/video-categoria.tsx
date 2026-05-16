import { COLORS } from "@/src/constants/colors";
import {
  getVideosByCategoria,
  VideoExercicio,
} from "@/src/services/videoService";
import { MaterialIcons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const VIDEO_PLAYER_HEIGHT = (SCREEN_WIDTH * 9) / 16; // 16:9 aspect ratio

export default function VideoCategoriaScreen() {
  const router = useRouter();
  const { categoria } = useLocalSearchParams<{ categoria: string }>();
  const [videos, setVideos] = useState<VideoExercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoExercicio | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const videoRef = useRef<Video>(null);

  useFocusEffect(
    useCallback(() => {
      if (categoria) {
        loadVideos();
      }
    }, [categoria]),
  );

  async function loadVideos() {
    setLoading(true);
    const response = await getVideosByCategoria(categoria ?? "");
    if (response.success && response.videos) {
      setVideos(response.videos);
    }
    setLoading(false);
  }

  function handlePlayVideo(video: VideoExercicio) {
    setSelectedVideo(video);
    setModalVisible(true);
  }

  function handleCloseModal() {
    setModalVisible(false);
    setSelectedVideo(null);
  }

  function renderVideoItem({ item }: { item: VideoExercicio }) {
    return (
      <TouchableOpacity
        style={styles.videoCard}
        onPress={() => handlePlayVideo(item)}
        activeOpacity={0.7}
      >
        {/* Thumbnail */}
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: item.thumbnailUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <MaterialIcons name="play-arrow" size={32} color={COLORS.white} />
            </View>
          </View>
        </View>

        {/* Info */}
        <View style={styles.videoInfo}>
          <Text style={styles.videoNome} numberOfLines={2}>
            {item.nomeExercicio}
          </Text>
          <Text style={styles.videoCategoria}>{item.categoria}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
        >
          <MaterialIcons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {categoria ?? "Vídeos"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Content */}
      <View
        style={
          loading || videos.length === 0
            ? styles.contentEmpty
            : styles.content
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : videos.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="videocam-off"
              size={64}
              color={COLORS.icon}
            />
            <Text style={styles.emptyText}>
              Nenhum vídeo disponível nesta categoria.
            </Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            keyExtractor={(item) => item.videoUrl}
            renderItem={renderVideoItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Video Player Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseModal} hitSlop={12}>
              <MaterialIcons name="close" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle} numberOfLines={1}>
              {selectedVideo?.nomeExercicio ?? ""}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Video Player */}
          {selectedVideo && (
            <View style={styles.playerContainer}>
              {Platform.OS === "web" ? (
                <video
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  style={{
                    width: "100%",
                    maxHeight: VIDEO_PLAYER_HEIGHT,
                    backgroundColor: "#000",
                    borderRadius: 12,
                  }}
                />
              ) : (
                <Video
                  ref={videoRef}
                  source={{ uri: selectedVideo.videoUrl }}
                  style={styles.videoPlayer}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay
                />
              )}

              {/* Exercise Info */}
              <View style={styles.exerciseDetails}>
                <Text style={styles.exerciseTitle}>
                  {selectedVideo.nomeExercicio}
                </Text>
                <View style={styles.exerciseCategoriaTag}>
                  <MaterialIcons
                    name="label"
                    size={16}
                    color={COLORS.primary}
                  />
                  <Text style={styles.exerciseCategoriaText}>
                    {selectedVideo.categoria}
                  </Text>
                </View>
                <Text style={styles.exerciseHint}>
                  Observe a execução correta do exercício para evitar lesões e
                  maximizar os resultados.
                </Text>
              </View>
            </View>
          )}
        </SafeAreaView>
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
  videoCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },
  thumbnailContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#1a1a24",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(124, 58, 237, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoInfo: {
    padding: 14,
  },
  videoNome: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  videoCategoria: {
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

  // Modal / Player styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  playerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  videoPlayer: {
    width: "100%",
    height: VIDEO_PLAYER_HEIGHT,
    borderRadius: 12,
    backgroundColor: "#000",
  },
  exerciseDetails: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.darkCard,
    borderRadius: 14,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 8,
  },
  exerciseCategoriaTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  exerciseCategoriaText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  exerciseHint: {
    fontSize: 14,
    color: COLORS.icon,
    lineHeight: 20,
  },
});
