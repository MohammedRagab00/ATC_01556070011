package com.ragab.booking.api.admin.dto;

public record UserSearchResponse(
        Integer id,
        String email,
        boolean isAdmin
) {
}
