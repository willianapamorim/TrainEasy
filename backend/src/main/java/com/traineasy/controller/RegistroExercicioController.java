package com.traineasy.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.traineasy.dto.RegistroExercicioRequest;
import com.traineasy.dto.RegistroExercicioResponse;
import com.traineasy.service.RegistroExercicioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/registros")
public class RegistroExercicioController {

    private final RegistroExercicioService registroService;

    public RegistroExercicioController(RegistroExercicioService registroService) {
        this.registroService = registroService;
    }

    @PostMapping
    public ResponseEntity<RegistroExercicioResponse> registrar(
            @Valid @RequestBody RegistroExercicioRequest request) {
        RegistroExercicioResponse response = registroService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/exercicio/{exercicioId}")
    public ResponseEntity<RegistroExercicioResponse> getByExercicio(
            @PathVariable Long exercicioId,
            @RequestParam Long userId) {
        RegistroExercicioResponse response = registroService.getRegistrosByExercicio(exercicioId, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroExercicioResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody RegistroExercicioRequest request) {
        RegistroExercicioResponse response = registroService.updateRegistro(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RegistroExercicioResponse> delete(@PathVariable Long id) {
        RegistroExercicioResponse response = registroService.deleteRegistro(id);
        return ResponseEntity.ok(response);
    }
}
