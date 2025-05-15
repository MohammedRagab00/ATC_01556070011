package com.ragab.booking.api.event.controller;

import com.ragab.booking.api.event.dto.BookedResponse;
import com.ragab.booking.api.event.dto.EventRequest;
import com.ragab.booking.api.event.dto.EventResponse;
import com.ragab.booking.api.event.service.EventService;
import com.ragab.booking.common.response.PageResponse;
import com.ragab.booking.config.security.userdetails.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Tag(name = "Events", description = "Endpoints for managing events and bookings")
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

    @Operation(summary = "Book an event", description = "Allows users to book an event")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Event booked successfully"),
            @ApiResponse(responseCode = "400", description = "Event has already been booked"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PostMapping("/{eventId}/book")
    @PreAuthorize("hasRole('USER')")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> bookEvent(
            @PathVariable Integer eventId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = userPrincipal.user().getId();
        Integer bookingId = eventService.bookEvent(userId, eventId);
        return ResponseEntity.created(URI.create("api/v1/event/" + bookingId + "/booked")).build();
    }

    @Operation(summary = "Cancel a booking", description = "Allows users to cancel their booking for an event")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Booking canceled successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "403", description = "Unauthorized to cancel this booking"),
            @ApiResponse(responseCode = "400", description = "Event has already passed")
    })
    @DeleteMapping("/{bookingId}/cancel")
    @PreAuthorize("hasRole('USER')")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Integer bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        eventService.cancelBooking(userPrincipal.user().getId(), bookingId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get booked events for a user", description = "Fetches a paginated list of booked events")
    @GetMapping("/booked")
    @PreAuthorize("hasRole('USER')")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<PageResponse<BookedResponse>> getBookedEvents(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = userPrincipal.user().getId();
        return ResponseEntity.ok(eventService.getBookedEvents(userId, page, size));
    }

    @Operation(summary = "Get booked event details for a user", description = "Fetches the booked event details")
    @GetMapping("/{bookingId}/booked")
    @PreAuthorize("hasRole('USER')")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<EventResponse> getBookedEvent(
            @PathVariable Integer bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = userPrincipal.user().getId();
        return ResponseEntity.ok(eventService.getBookedEvent(userId, bookingId));
    }
}
