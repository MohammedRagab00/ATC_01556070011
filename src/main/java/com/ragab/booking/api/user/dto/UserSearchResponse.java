package com.ragab.booking.api.user.dto;

public record UserSearchResponse(
        Integer id,
        String email,
        boolean isAdmin
) {
}
