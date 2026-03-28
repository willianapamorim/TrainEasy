package com.traineasy.controller;

import com.traineasy.dto.CreateTreinoRequest;
import com.traineasy.dto.TreinoResponse;
import com.traineasy.service.TreinoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/user/{userId}")
    public ResponseEntity<TreinoResponse> getByUser(@PathVariable Long userId) {
        TreinoResponse response = treinoService.getTreinosByUser(userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<TreinoResponse> delete(@PathVariable Long id) {
        TreinoResponse response = treinoService.deleteTreino(id);
        return ResponseEntity.ok(response);
    }
}
