package com.ragab.booking.api.auth.dto;

import lombok.Builder;

@Builder
public record AuthenticationResponse(
        String token,
        String refreshToken,
        boolean isAdmin,
        String email,
        String fullName
) {
}
