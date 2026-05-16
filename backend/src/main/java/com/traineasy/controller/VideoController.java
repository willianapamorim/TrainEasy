package com.traineasy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.traineasy.dto.VideoResponse;
import com.traineasy.service.VideoService;

@RestController
@RequestMapping("/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    /**
     * Lista todas as categorias de vídeos disponíveis.
     * GET /videos/categorias
     */
    @GetMapping("/categorias")
    public ResponseEntity<VideoResponse> listarCategorias() {
        VideoResponse response = videoService.listarCategorias();
        return ResponseEntity.ok(response);
    }

    /**
     * Lista todos os vídeos de uma categoria específica.
     * GET /videos/categoria/{nome}
     */
    @GetMapping("/categoria/{nome}")
    public ResponseEntity<VideoResponse> listarVideosPorCategoria(@PathVariable String nome) {
        VideoResponse response = videoService.listarVideosPorCategoria(nome);
        return ResponseEntity.ok(response);
    }
}
