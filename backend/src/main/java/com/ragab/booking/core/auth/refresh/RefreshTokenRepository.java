package com.ragab.booking.core.auth.refresh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends
        JpaRepository<RefreshToken, Integer>,
        JpaSpecificationExecutor<RefreshToken> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findAllByCreatedDateBeforeOrRevoked(LocalDateTime createdDateBefore, boolean revoked);
}
