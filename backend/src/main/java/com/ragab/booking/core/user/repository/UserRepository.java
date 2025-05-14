package com.ragab.booking.core.user.repository;

import com.ragab.booking.core.user.model.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<Users> findByEmailContainingIgnoreCase(String email, Pageable pageable);
}
