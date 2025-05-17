package com.ragab.booking.core.booking.mapper;

import com.ragab.booking.api.booking.dto.BookedResponse;
import com.ragab.booking.core.booking.model.Booking;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {
    public BookedResponse toResponse(Booking booking) {
        return new BookedResponse(
                booking.getId(),
                booking.getEvent().getName(),
                booking.getEvent().getEventDate(),
                booking.getCreatedDate()
        );
    }
}
