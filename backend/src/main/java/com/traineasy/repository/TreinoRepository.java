package com.traineasy.repository;

import com.traineasy.entity.Treino;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TreinoRepository extends JpaRepository<Treino, Long> {

    List<Treino> findByUserIdOrderByCreatedAtDesc(Long userId);
}
