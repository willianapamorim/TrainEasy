package com.traineasy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TreinoResponse {

    private boolean success;
    private String message;
    private TreinoData treino;
    private List<TreinoData> treinos;

    public static TreinoResponse success(String message, TreinoData treino) {
        return new TreinoResponse(true, message, treino, null);
    }

    public static TreinoResponse successList(String message, List<TreinoData> treinos) {
        return new TreinoResponse(true, message, null, treinos);
    }

    public static TreinoResponse error(String message) {
        return new TreinoResponse(false, message, null, null);
    }

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
}
