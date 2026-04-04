package com.traineasy.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTreinoCompletoRequest {

    @Getter
    @Setter
    public static class DivisaoRequest {
        @NotBlank(message = "O nome da divisão é obrigatório")
        private String nome;

        private List<String> exercicios;
    }

    @NotBlank(message = "O nome do treino é obrigatório")
    private String nome;

    @NotBlank(message = "O tipo do treino é obrigatório")
    private String tipo;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;

    private List<DivisaoRequest> divisoes;
}
