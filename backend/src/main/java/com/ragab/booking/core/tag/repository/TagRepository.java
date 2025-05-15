package com.ragab.booking.core.tag.repository;

import com.ragab.booking.core.tag.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    Optional<Tag> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}