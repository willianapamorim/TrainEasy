package com.traineasy.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String email) {
        super("Usuário não encontrado com email: " + email);
    }
}
