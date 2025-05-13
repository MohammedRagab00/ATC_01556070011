package com.ragab.booking.api.user.dto;

import com.ragab.booking.core.user.model.Gender;

import java.time.LocalDate;

public record UserProfileResponse(
        String firstName,
        String lastName,
        String email,
        Gender gender,
        int age,
        LocalDate birthDate,
        String photoUrl

) {
}
