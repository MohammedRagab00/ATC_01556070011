package com.ragab.booking.core.event.mapper;

import com.ragab.booking.api.event.dto.EventRequest;
import com.ragab.booking.api.event.dto.EventResponse;
import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.tag.model.Tag;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class EventMapper {
    public EventResponse toResponse(Event event, String imageUrl) {
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getEventDate(),
                event.getPrice(),
                event.getVenue(),
                event.getCategory() != null ? event.getCategory().getName() : null,
                event.getTags().stream().map(Tag::getName).collect(Collectors.toSet()),
                imageUrl,
                event.isUpcoming()
        );
    }

    public Event toEntity(EventRequest dto) {
        Event event = new Event();
        event.setName(dto.name());
        event.setDescription(dto.description());
        event.setEventDate(dto.eventDate());
        event.setPrice(dto.price());
        event.setVenue(dto.venue());
        return event;
    }

}
