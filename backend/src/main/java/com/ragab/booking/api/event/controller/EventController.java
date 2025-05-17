package com.ragab.booking.api.event.controller;

import com.ragab.booking.api.event.dto.EventResponse;
import com.ragab.booking.api.event.service.EventService;
import com.ragab.booking.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Tag(name = "Events", description = "Endpoints for retrieving events")
@RestController
@RequestMapping("/event")
public class EventController {
    private final EventService eventService;

    @Operation(summary = "Retrieve all events", description = "Returns a paginated list of events")
    @GetMapping
    public ResponseEntity<PageResponse<EventResponse>> getEvents(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size
    ) {
        return ResponseEntity.ok(eventService.getEvents(page, size));
    }

    @Operation(summary = "Retrieve an event by ID", description = "Fetches details of a specific event")
    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponse> getEvent(
            @PathVariable Integer eventId
    ) {
        EventResponse event = eventService.getEvent(eventId);
        return ResponseEntity.ok(event);
    }
}
