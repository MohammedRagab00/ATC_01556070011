package com.ragab.booking.api.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record UpdateProfileRequest(
        @NotBlank(message = "First name is required")
        String firstname,

        @NotBlank(message = "Last name is required")
        String lastname,

        @NotBlank(message = "Gender is required")
        String gender,

        @Past(message = "Date of birth must be in the past")
        LocalDate birthDate
) {
}
