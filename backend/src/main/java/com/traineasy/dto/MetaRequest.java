package com.traineasy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MetaRequest {

    @NotBlank(message = "O título é obrigatório")
    @Size(max = 100, message = "O título deve ter no máximo 100 caracteres")
    private String titulo;

    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    private String descricao;

    @NotNull(message = "O ID do usuário é obrigatório")
    private Long userId;

    private Boolean concluida;
}
