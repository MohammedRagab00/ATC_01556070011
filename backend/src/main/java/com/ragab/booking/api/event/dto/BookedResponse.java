package com.ragab.booking.api.event.dto;

import java.time.LocalDateTime;

public record BookedResponse(
        Integer bookingId,
        String eventName,
        LocalDateTime eventDate,
        LocalDateTime bookedAt
) {
}
