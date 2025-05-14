package com.ragab.booking.core.auth.refresh;

import com.ragab.booking.common.exception.custom.InvalidRefreshTokenException;
import com.ragab.booking.core.user.model.Users;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class RefreshTokenService {
    private final RefreshTokenRepository repo;

    @Value("${application.security.jwt.refresh-token.expiration-days}")
    private int refreshTokenExpirationDays;

    @Scheduled(cron = "0 0 0 * * *")
    public void cleanupExpiredTokens() {
        LocalDateTime expirationTime = LocalDateTime.now().minusDays(refreshTokenExpirationDays);
        List<RefreshToken> expiredTokens = repo.findAllByCreatedDateBeforeOrRevoked(expirationTime, true);

        if (!expiredTokens.isEmpty()) {
            repo.deleteAll(expiredTokens);
        }
    }


    public RefreshToken createRefreshToken(Users user) {
        // Generate a secure random token
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

        // Create the refresh token entity
        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .user(user)
                .revoked(false)
                .build();

        return repo.save(refreshToken);

    }

    public Optional<RefreshToken> findByToken(String token) {
        return repo.findByToken(token);
    }

    public boolean isTokenValid(RefreshToken token) {
        // Check if the token is revoked
        if (token.isRevoked()) {
            return false;
        }

        // Check if the token is expired - based on creation time from BaseEntity
        LocalDateTime expirationTime = token.getCreatedDate().plusDays(refreshTokenExpirationDays);
        if (LocalDateTime.now().isAfter(expirationTime)) {
            // Token has expired - revoke it
            token.setRevoked(true);
            repo.save(token);
            return false;
        }

        return true;
    }

    public void revokeRefreshToken(String token) {
        RefreshToken refreshToken = repo.findByToken(token)
                .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token not found"));

        refreshToken.setRevoked(true);
        repo.save(refreshToken);
    }

    public RefreshToken rotateRefreshToken(RefreshToken oldToken) {
        oldToken.setRevoked(true);
        repo.save(oldToken);

        return createRefreshToken(oldToken.getUser());
    }

    public void revokeAllUserTokens(Users user) {
        List<RefreshToken> validUserTokens = repo.findAll(
                RefreshTokenSpecification.findActiveTokensByUser(user.getId())
        );

        if (validUserTokens.isEmpty()) {
            return;
        }

        validUserTokens.forEach(token ->
                token.setRevoked(true)
        );

        repo.saveAll(validUserTokens);
    }
}
