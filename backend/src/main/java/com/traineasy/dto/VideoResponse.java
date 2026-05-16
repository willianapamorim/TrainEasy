package com.traineasy.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VideoResponse {

    public static VideoResponse successCategorias(String message, List<CategoriaVideoDTO> categorias) {
        VideoResponse r = new VideoResponse();
        r.success = true;
        r.message = message;
        r.categorias = categorias;
        return r;
    }

    public static VideoResponse successVideos(String message, List<VideoDTO> videos) {
        VideoResponse r = new VideoResponse();
        r.success = true;
        r.message = message;
        r.videos = videos;
        return r;
    }

    public static VideoResponse error(String message) {
        return new VideoResponse(false, message, null, null);
    }

    private boolean success;
    private String message;
    private List<CategoriaVideoDTO> categorias;
    private List<VideoDTO> videos;
}
