package com.traineasy.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistroExercicioRequest {

    @NotNull(message = "O ID do exercício é obrigatório")
    private Long exercicioId;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;

    @NotNull(message = "A carga é obrigatória")
    @Positive(message = "A carga deve ser positiva")
    private Double carga;

    @NotNull(message = "O número de repetições é obrigatório")
    @Positive(message = "O número de repetições deve ser positivo")
    private Integer repeticoes;

    @NotNull(message = "O número da série é obrigatório")
    @Positive(message = "O número da série deve ser positivo")
    private Integer numeroSerie;
}
