package com.traineasy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.traineasy.entity.Meta;

public interface MetaRepository extends JpaRepository<Meta, Long> {

    List<Meta> findByUserIdOrderByCreatedAtDesc(Long userId);
}
