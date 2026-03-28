package com.traineasy.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TreinoResponse {

    @Getter
    @Setter
    @AllArgsConstructor
    public static class TreinoData {
        private Long id;
        private String nome;
        private String tipo;
        private Long userId;
        private LocalDateTime createdAt;
    }

    public static TreinoResponse success(String message, TreinoData treino) {
        return new TreinoResponse(true, message, treino, null);
    }

    public static TreinoResponse successList(String message, List<TreinoData> treinos) {
        return new TreinoResponse(true, message, null, treinos);
    }

    public static TreinoResponse error(String message) {
        return new TreinoResponse(false, message, null, null);
    }

    private boolean success;

    private String message;

    private TreinoData treino;

    private List<TreinoData> treinos;
}
