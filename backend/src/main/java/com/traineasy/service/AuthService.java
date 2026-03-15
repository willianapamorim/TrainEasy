package com.traineasy.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.traineasy.dto.AuthResponse;
import com.traineasy.dto.LoginRequest;
import com.traineasy.dto.RegisterRequest;
import com.traineasy.entity.User;
import com.traineasy.exception.EmailAlreadyExistsException;
import com.traineasy.exception.InvalidPasswordException;
import com.traineasy.exception.UserNotFoundException;
import com.traineasy.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = new User();
        user.setNome(request.getNome());
        user.setEmail(request.getEmail());
        user.setSenha(passwordEncoder.encode(request.getSenha()));

        User savedUser = userRepository.save(user);

        return AuthResponse.success(
                "Conta criada com sucesso!",
                new AuthResponse.UserData(savedUser.getId(), savedUser.getNome(), savedUser.getEmail()));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        if (!passwordEncoder.matches(request.getSenha(), user.getSenha())) {
            throw new InvalidPasswordException();
        }

        return AuthResponse.success(
                "Login realizado com sucesso!",
                new AuthResponse.UserData(user.getId(), user.getNome(), user.getEmail()));
    }
}
