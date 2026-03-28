package com.traineasy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTreinoRequest {

    @NotBlank(message = "O nome do treino é obrigatório")
    private String nome;

    @NotBlank(message = "O tipo do treino é obrigatório")
    private String tipo;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;
}
