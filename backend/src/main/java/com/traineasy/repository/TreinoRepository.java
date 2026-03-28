package com.traineasy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.traineasy.entity.Treino;

public interface TreinoRepository extends JpaRepository<Treino, Long> {

    List<Treino> findByUserIdOrderByCreatedAtDesc(Long userId);
}
