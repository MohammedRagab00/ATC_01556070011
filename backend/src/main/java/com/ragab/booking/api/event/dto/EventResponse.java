package com.ragab.booking.api.event.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record EventResponse(
        Integer id,
        String name,
        String description,
        LocalDateTime eventDate,
        BigDecimal price,
        String venue,
        String category,
        Set<String> tags,
        String imageUrl
) {
}
