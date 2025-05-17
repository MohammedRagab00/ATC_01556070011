package com.ragab.booking.api.booking.dto;

import java.time.LocalDateTime;

public record BookedResponse(
        Integer bookingId,
        Integer eventId,
        String eventName,
        LocalDateTime eventDate,
        LocalDateTime bookedAt
) {
}
