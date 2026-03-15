package com.traineasy.exception;

public class InvalidPasswordException extends RuntimeException {

    public InvalidPasswordException() {
        super("Senha inválida");
    }
}
