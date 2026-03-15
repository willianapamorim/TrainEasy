package com.traineasy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private boolean success;
    private String message;
    private UserData user;

    public static AuthResponse success(String message, UserData user) {
        return new AuthResponse(true, message, user);
    }

    public static AuthResponse error(String message) {
        return new AuthResponse(false, message, null);
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class UserData {
        private Long id;
        private String nome;
        private String email;
    }
}
