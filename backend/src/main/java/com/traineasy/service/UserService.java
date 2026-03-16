package com.traineasy.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.traineasy.dto.AuthResponse;
import com.traineasy.dto.UpdateUserRequest;
import com.traineasy.entity.User;
import com.traineasy.exception.EmailAlreadyExistsException;
import com.traineasy.exception.UserNotFoundException;
import com.traineasy.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse getUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        return AuthResponse.success(
                "Usuário encontrado",
                new AuthResponse.UserData(user.getId(), user.getNome(), user.getEmail()));
    }

    public AuthResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuário não encontrado"));

        if (request.getNome() != null && !request.getNome().isBlank()) {
            user.setNome(request.getNome());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new EmailAlreadyExistsException(request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        if (request.getSenha() != null && !request.getSenha().isBlank()) {
            user.setSenha(passwordEncoder.encode(request.getSenha()));
        }

        User updatedUser = userRepository.save(user);

        return AuthResponse.success(
                "Dados atualizados com sucesso!",
                new AuthResponse.UserData(updatedUser.getId(), updatedUser.getNome(), updatedUser.getEmail()));
    }

    public AuthResponse deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Usuário não encontrado");
        }

        userRepository.deleteById(id);

        return AuthResponse.success("Conta excluída com sucesso!", null);
    }
}
