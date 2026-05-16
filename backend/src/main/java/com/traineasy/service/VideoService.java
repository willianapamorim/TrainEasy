package com.traineasy.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.traineasy.config.CloudinaryConfig;
import com.traineasy.dto.CategoriaVideoDTO;
import com.traineasy.dto.VideoDTO;
import com.traineasy.dto.VideoResponse;

/**
 * Serviço responsável por listar categorias e vídeos de exercícios
 * armazenados no Cloudinary.
 *
 * Estrutura esperada no Cloudinary:
 *   videos/{Categoria}/{NomeExercicio}.mp4
 *
 * Usa a Admin API do Cloudinary com Basic Auth para listar pastas e recursos,
 * e gera URLs públicas de delivery para os vídeos e suas thumbnails.
 */
@Service
public class VideoService {

    private static final Logger log = LoggerFactory.getLogger(VideoService.class);

    private static final String ROOT_FOLDER = "videos";

    /** Transformação Cloudinary para gerar thumbnail a partir do vídeo */
    private static final String THUMB_TRANSFORMATION = "so_0,w_480,h_270,c_fill,q_auto,f_jpg";

    private final RestTemplate restTemplate;
    private final CloudinaryConfig cloudinaryConfig;

    public VideoService(RestTemplate restTemplate, CloudinaryConfig cloudinaryConfig) {
        this.restTemplate = restTemplate;
        this.cloudinaryConfig = cloudinaryConfig;
    }

    /**
     * Lista todas as categorias (subpastas de "videos/") com a quantidade de vídeos.
     */
    public VideoResponse listarCategorias() {
        try {
            String url = cloudinaryConfig.getAdminApiBaseUrl()
                    + "/folders/" + ROOT_FOLDER;

            log.info("Listando categorias: {}", url);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, authEntity(), Map.class);

            Map<String, Object> body = response.getBody();
            if (body == null || !body.containsKey("folders")) {
                return VideoResponse.successCategorias("Nenhuma categoria encontrada.", List.of());
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> folders = (List<Map<String, Object>>) body.get("folders");

            List<CategoriaVideoDTO> categorias = new ArrayList<>();

            for (Map<String, Object> folder : folders) {
                String nome = (String) folder.get("name");
                String path = (String) folder.get("path");

                int count = contarVideosPorPasta(path);
                categorias.add(new CategoriaVideoDTO(nome, count));
            }

            return VideoResponse.successCategorias("Categorias carregadas.", categorias);
        } catch (Exception e) {
            log.error("Erro ao listar categorias: {}", e.getMessage(), e);
            return VideoResponse.error("Erro ao carregar categorias: " + e.getMessage());
        }
    }

    /**
     * Lista todos os vídeos de uma categoria específica.
     * Usa a Resources API com prefix para buscar vídeos na pasta.
     */
    public VideoResponse listarVideosPorCategoria(String categoria) {
        try {
            String prefix = ROOT_FOLDER + "/" + categoria + "/";
            String encodedPrefix = URLEncoder.encode(prefix, StandardCharsets.UTF_8);

            String url = cloudinaryConfig.getAdminApiBaseUrl()
                    + "/resources/video/upload"
                    + "?prefix=" + encodedPrefix
                    + "&type=upload"
                    + "&max_results=100";

            log.info("Listando vídeos da categoria '{}': {}", categoria, url);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, authEntity(), Map.class);

            Map<String, Object> body = response.getBody();

            log.info("Response body keys: {}", body != null ? body.keySet() : "null");

            if (body == null || !body.containsKey("resources")) {
                return VideoResponse.successVideos("Nenhum vídeo encontrado.", List.of());
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> resources = (List<Map<String, Object>>) body.get("resources");

            log.info("Encontrados {} recursos na categoria '{}'", resources.size(), categoria);

            List<VideoDTO> videos = new ArrayList<>();

            for (Map<String, Object> resource : resources) {
                String publicId = (String) resource.get("public_id");
                String format = (String) resource.get("format");

                // Extrai o nome do exercício do public_id (última parte do path)
                String nomeExercicio = publicId;
                int lastSlash = publicId.lastIndexOf('/');
                if (lastSlash >= 0) {
                    nomeExercicio = publicId.substring(lastSlash + 1);
                }

                String videoUrl = gerarVideoUrl(publicId, format);
                String thumbnailUrl = gerarThumbnailUrl(publicId);

                videos.add(new VideoDTO(nomeExercicio, categoria, videoUrl, thumbnailUrl));
            }

            return VideoResponse.successVideos("Vídeos carregados.", videos);
        } catch (Exception e) {
            log.error("Erro ao listar vídeos da categoria '{}': {}", categoria, e.getMessage(), e);
            return VideoResponse.error("Erro ao carregar vídeos: " + e.getMessage());
        }
    }

    /**
     * Conta o número de vídeos em uma pasta usando a Resources API com prefix.
     */
    private int contarVideosPorPasta(String folderPath) {
        try {
            String prefix = folderPath + "/";
            String encodedPrefix = URLEncoder.encode(prefix, StandardCharsets.UTF_8);

            String url = cloudinaryConfig.getAdminApiBaseUrl()
                    + "/resources/video/upload"
                    + "?prefix=" + encodedPrefix
                    + "&max_results=0";

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, authEntity(), Map.class);

            Map<String, Object> body = response.getBody();

            // A Resources API retorna os resources, não total_count
            // Precisamos contar os resources retornados
            if (body != null && body.containsKey("resources")) {
                @SuppressWarnings("unchecked")
                List<?> resources = (List<?>) body.get("resources");
                return resources.size();
            }

            // Fallback: tentar com max_results=500 para contagem
            url = cloudinaryConfig.getAdminApiBaseUrl()
                    + "/resources/video/upload"
                    + "?prefix=" + encodedPrefix
                    + "&max_results=500";

            response = restTemplate.exchange(
                    url, HttpMethod.GET, authEntity(), Map.class);

            body = response.getBody();
            if (body != null && body.containsKey("resources")) {
                @SuppressWarnings("unchecked")
                List<?> resources = (List<?>) body.get("resources");
                return resources.size();
            }

            return 0;
        } catch (Exception e) {
            log.warn("Erro ao contar vídeos em '{}': {}", folderPath, e.getMessage());
            return 0;
        }
    }

    /**
     * Gera URL pública de delivery do vídeo.
     * Formato: https://res.cloudinary.com/{cloud}/video/upload/{public_id}.{format}
     */
    private String gerarVideoUrl(String publicId, String format) {
        return cloudinaryConfig.getDeliveryBaseUrl()
                + "/video/upload/" + publicId + "." + (format != null ? format : "mp4");
    }

    /**
     * Gera URL de thumbnail extraída do primeiro frame do vídeo.
     * Usa transformações do Cloudinary para criar um frame de 480x270 em JPG.
     * Formato: https://res.cloudinary.com/{cloud}/video/upload/{transformations}/{public_id}.jpg
     */
    private String gerarThumbnailUrl(String publicId) {
        return cloudinaryConfig.getDeliveryBaseUrl()
                + "/video/upload/" + THUMB_TRANSFORMATION + "/" + publicId + ".jpg";
    }

    /**
     * Cria um HttpEntity com o header de Basic Auth para a Admin API do Cloudinary.
     */
    private HttpEntity<Void> authEntity() {
        String credentials = cloudinaryConfig.getApiKey() + ":" + cloudinaryConfig.getApiSecret();
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encoded);
        return new HttpEntity<>(headers);
    }
}
