package com.ragab.booking.core.tag.repository;

import com.ragab.booking.core.tag.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, Integer> {
}