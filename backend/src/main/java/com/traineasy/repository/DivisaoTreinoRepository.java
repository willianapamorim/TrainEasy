package com.traineasy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.traineasy.entity.DivisaoTreino;

public interface DivisaoTreinoRepository extends JpaRepository<DivisaoTreino, Long> {

    List<DivisaoTreino> findByTreinoIdOrderByIdAsc(Long treinoId);
}
