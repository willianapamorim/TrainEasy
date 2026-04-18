package com.traineasy.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MetaResponse {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MetaData {
        private Long id;
        private String titulo;
        private String descricao;
        private Boolean concluida;
        private Long userId;
        private LocalDateTime createdAt;
    }

    public static MetaResponse success(String message, MetaData meta) {
        return new MetaResponse(true, message, meta, null);
    }

    public static MetaResponse successList(String message, List<MetaData> metas) {
        return new MetaResponse(true, message, null, metas);
    }

    public static MetaResponse error(String message) {
        return new MetaResponse(false, message, null, null);
    }

    private boolean success;
    private String message;
    private MetaData meta;
    private List<MetaData> metas;
}
