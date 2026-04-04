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
public class RegistroExercicioResponse {

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RegistroData {
        private Long id;
        private Long exercicioId;
        private String exercicioNome;
        private Long userId;
        private Double carga;
        private Integer repeticoes;
        private Integer numeroSerie;
        private LocalDateTime createdAt;
    }

    public static RegistroExercicioResponse success(String message, RegistroData registro) {
        return new RegistroExercicioResponse(true, message, registro, null);
    }

    public static RegistroExercicioResponse successList(String message, List<RegistroData> registros) {
        return new RegistroExercicioResponse(true, message, null, registros);
    }

    public static RegistroExercicioResponse error(String message) {
        return new RegistroExercicioResponse(false, message, null, null);
    }

    private boolean success;

    private String message;

    private RegistroData registro;

    private List<RegistroData> registros;
}
