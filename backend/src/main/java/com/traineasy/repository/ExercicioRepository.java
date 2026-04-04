package com.traineasy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.traineasy.entity.Exercicio;

public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {

    List<Exercicio> findByDivisaoIdOrderByIdAsc(Long divisaoId);
}
