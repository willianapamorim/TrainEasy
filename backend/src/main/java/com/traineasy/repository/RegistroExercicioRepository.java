package com.traineasy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.traineasy.entity.RegistroExercicio;

public interface RegistroExercicioRepository extends JpaRepository<RegistroExercicio, Long> {

    List<RegistroExercicio> findByExercicioIdAndUserIdOrderByCreatedAtDesc(Long exercicioId, Long userId);

    List<RegistroExercicio> findByUserIdOrderByCreatedAtDesc(Long userId);
}
