package com.traineasy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @Size(min = 1, max = 100, message = "O nome deve ter entre 1 e 100 caracteres")
    private String nome;

    @Email(message = "Email inválido")
    private String email;

    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;
}
