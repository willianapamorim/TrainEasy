package com.traineasy.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.traineasy.dto.CreateTreinoCompletoRequest;
import com.traineasy.dto.CreateTreinoRequest;
import com.traineasy.dto.TreinoCompletoResponse;
import com.traineasy.dto.TreinoResponse;
import com.traineasy.service.TreinoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/treinos")
public class TreinoController {

    private final TreinoService treinoService;

    public TreinoController(TreinoService treinoService) {
        this.treinoService = treinoService;
    }

    @PostMapping
    public ResponseEntity<TreinoResponse> create(@Valid @RequestBody CreateTreinoRequest request) {
        TreinoResponse response = treinoService.createTreino(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/completo")
    public ResponseEntity<TreinoCompletoResponse> createCompleto(
            @Valid @RequestBody CreateTreinoCompletoRequest request) {
        TreinoCompletoResponse response = treinoService.createTreinoCompleto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<TreinoResponse> getByUser(@PathVariable Long userId) {
        TreinoResponse response = treinoService.getTreinosByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}/completo")
    public ResponseEntity<TreinoCompletoResponse> getCompletoByUser(@PathVariable Long userId) {
        TreinoCompletoResponse response = treinoService.getTreinosCompletosByUser(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/completo")
    public ResponseEntity<TreinoCompletoResponse> getCompleto(@PathVariable Long id) {
        TreinoCompletoResponse response = treinoService.getTreinoCompleto(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TreinoResponse> delete(@PathVariable Long id) {
        TreinoResponse response = treinoService.deleteTreino(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/divisoes/{divisaoId}/exercicios")
    public ResponseEntity<TreinoCompletoResponse> updateDivisaoExercicios(
            @PathVariable Long divisaoId,
            @RequestBody List<String> exercicios) {
        TreinoCompletoResponse response = treinoService.updateDivisaoExercicios(divisaoId, exercicios);
        return ResponseEntity.ok(response);
    }
}
