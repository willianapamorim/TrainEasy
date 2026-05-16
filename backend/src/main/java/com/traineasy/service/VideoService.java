package com.traineasy.service;

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
     * Lista todas as categorias (subpastas de "videos/").
     */
    public VideoResponse listarCategorias() {
        try {
            String url = cloudinaryConfig.getAdminApiBaseUrl() + "/folders/" + ROOT_FOLDER;
            
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

                // Buscamos a contagem usando a Search API (mais precisa)
                int count = contarVideosPorPasta(path);
                categorias.add(new CategoriaVideoDTO(nome, count));
            }

            return VideoResponse.successCategorias("Categorias carregadas.", categorias);
        } catch (Exception e) {
            log.error("Erro ao listar categorias: {}", e.getMessage());
            return VideoResponse.error("Erro ao carregar categorias.");
        }
    }

    /**
     * Lista todos os vídeos de uma categoria específica.
     */
    public VideoResponse listarVideosPorCategoria(String categoria) {
        try {
            String folderPath = ROOT_FOLDER + "/" + categoria;
            
            // Usamos a Search API com um JSON no body para evitar problemas de encoding na URL
            String url = cloudinaryConfig.getAdminApiBaseUrl() + "/resources/search";
            
            Map<String, Object> searchRequest = Map.of(
                "expression", "folder:\"" + folderPath + "\"",
                "max_results", 100
            );

            HttpHeaders headers = createHeaders();
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(searchRequest, headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || !body.containsKey("resources")) {
                return VideoResponse.successVideos("Nenhum vídeo encontrado.", List.of());
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> resources = (List<Map<String, Object>>) body.get("resources");
            List<VideoDTO> videos = new ArrayList<>();

            for (Map<String, Object> resource : resources) {
                String publicId = (String) resource.get("public_id");
                String format = (String) resource.get("format");

                String nomeExercicio = publicId;
                int lastSlash = publicId.lastIndexOf('/');
                if (lastSlash >= 0) {
                    nomeExercicio = publicId.substring(lastSlash + 1);
                }

                videos.add(new VideoDTO(
                    nomeExercicio, 
                    categoria, 
                    gerarVideoUrl(publicId, format), 
                    gerarThumbnailUrl(publicId)
                ));
            }

            return VideoResponse.successVideos("Vídeos carregados.", videos);
        } catch (Exception e) {
            log.error("Erro ao listar vídeos: {}", e.getMessage());
            return VideoResponse.error("Erro ao carregar vídeos.");
        }
    }

    private int contarVideosPorPasta(String folderPath) {
        try {
            String url = cloudinaryConfig.getAdminApiBaseUrl() + "/resources/search";
            Map<String, Object> searchRequest = Map.of(
                "expression", "folder:\"" + folderPath + "\"",
                "max_results", 1
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(searchRequest, createHeaders());
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("total_count")) {
                return ((Number) body.get("total_count")).intValue();
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    private String gerarVideoUrl(String publicId, String format) {
        return cloudinaryConfig.getDeliveryBaseUrl() + "/video/upload/" + publicId + "." + (format != null ? format : "mp4");
    }

    private String gerarThumbnailUrl(String publicId) {
        return cloudinaryConfig.getDeliveryBaseUrl() + "/video/upload/" + THUMB_TRANSFORMATION + "/" + publicId + ".jpg";
    }

    private HttpHeaders createHeaders() {
        String credentials = cloudinaryConfig.getApiKey() + ":" + cloudinaryConfig.getApiSecret();
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes());
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + encoded);
        headers.set("Content-Type", "application/json");
        return headers;
    }

    private HttpEntity<Void> authEntity() {
        return new HttpEntity<>(createHeaders());
    }
}
