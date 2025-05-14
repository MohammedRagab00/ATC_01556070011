package com.ragab.booking.core.event.specification;

import com.ragab.booking.core.event.model.Event;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class EventSpecification {

    public static Specification<Event> inFuture() {
        return (root, query, cb) ->
                cb.greaterThan(root.get("eventDate"), LocalDateTime.now());
    }
}
