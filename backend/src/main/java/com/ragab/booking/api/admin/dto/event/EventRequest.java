package com.ragab.booking.api.admin.dto.event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record EventRequest(
        @NotBlank(message = "Name is required")
        String name,
        String description,
        @Future(message = "Event date must be in the future")
        LocalDateTime eventDate,
        @NotNull(message = "Price is required")
        @PositiveOrZero(message = "Price must be greater than or equal to zero")
        BigDecimal price,
        @NotBlank(message = "Venue is required")
        String venue,
        String category
) {
}
