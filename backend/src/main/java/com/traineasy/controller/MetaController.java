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
import org.springframework.web.bind.annotation.RestController;

import com.traineasy.dto.MetaRequest;
import com.traineasy.dto.MetaResponse;
import com.traineasy.service.MetaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/metas")
public class MetaController {

    private final MetaService metaService;

    public MetaController(MetaService metaService) {
        this.metaService = metaService;
    }

    @PostMapping
    public ResponseEntity<MetaResponse> criar(@Valid @RequestBody MetaRequest request) {
        MetaResponse response = metaService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<MetaResponse> listarPorUsuario(@PathVariable Long userId) {
        MetaResponse response = metaService.listarPorUsuario(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MetaRequest request) {
        MetaResponse response = metaService.atualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MetaResponse> excluir(@PathVariable Long id) {
        MetaResponse response = metaService.excluir(id);
        return ResponseEntity.ok(response);
    }
}
