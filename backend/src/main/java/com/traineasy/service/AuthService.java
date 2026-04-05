package com.traineasy.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.traineasy.dto.AuthResponse;
import com.traineasy.dto.ForgotPasswordRequest;
import com.traineasy.dto.LoginRequest;
import com.traineasy.dto.RegisterRequest;
import com.traineasy.dto.ResetPasswordRequest;
import com.traineasy.entity.User;
import com.traineasy.exception.EmailAlreadyExistsException;
import com.traineasy.exception.InvalidPasswordException;
import com.traineasy.exception.UserNotFoundException;
import com.traineasy.repository.UserRepository;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
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

    @Transactional
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        String code = String.format("%06d", secureRandom.nextInt(1_000_000));

        user.setResetToken(passwordEncoder.encode(code));
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        String emailText = "Olá " + user.getNome() + ",\n\n"
                + "Seu código de recuperação de senha é: " + code + "\n\n"
                + "Este código expira em 15 minutos.\n\n"
                + "Se você não solicitou a recuperação, ignore este e-mail.\n\n"
                + "Equipe TrainEasy";

        try {
            emailService.sendEmail(user.getEmail(),
                    "TrainEasy - Código de recuperação de senha", emailText);
        } catch (Exception e) {
            log.error("Erro ao enviar email de recuperação: {}", e.getMessage(), e);
            return AuthResponse.error("Falha ao enviar e-mail. Tente novamente mais tarde.");
        }

        return AuthResponse.success("Código de recuperação enviado para o e-mail.", null);
    }

    @Transactional
    public AuthResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        if (user.getResetToken() == null || user.getResetTokenExpiry() == null) {
            return AuthResponse.error("Nenhuma solicitação de recuperação encontrada.");
        }

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            return AuthResponse.error("Código expirado. Solicite um novo código.");
        }

        if (!passwordEncoder.matches(request.getCode(), user.getResetToken())) {
            return AuthResponse.error("Código inválido.");
        }

        user.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return AuthResponse.success("Senha alterada com sucesso!", null);
    }
}
