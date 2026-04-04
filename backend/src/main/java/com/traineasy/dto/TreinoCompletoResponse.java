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
public class TreinoCompletoResponse {

    private boolean success;
    private String message;
    private TreinoCompletoData treino;
    private List<TreinoCompletoData> treinos;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TreinoCompletoData {
        private Long id;
        private String nome;
        private String tipo;
        private Long userId;
        private LocalDateTime createdAt;
        private List<DivisaoData> divisoes;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DivisaoData {
        private Long id;
        private String nome;
        private List<ExercicioData> exercicios;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ExercicioData {
        private Long id;
        private String nome;
    }

    public static TreinoCompletoResponse success(String message, TreinoCompletoData treino) {
        return new TreinoCompletoResponse(true, message, treino, null);
    }

    public static TreinoCompletoResponse successList(String message, List<TreinoCompletoData> treinos) {
        return new TreinoCompletoResponse(true, message, null, treinos);
    }

    public static TreinoCompletoResponse error(String message) {
        return new TreinoCompletoResponse(false, message, null, null);
    }
}
