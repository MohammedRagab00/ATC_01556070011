package com.ragab.booking.api.booking.controller;

import com.ragab.booking.api.booking.dto.BookedResponse;
import com.ragab.booking.api.booking.service.BookingService;
import com.ragab.booking.api.event.dto.EventResponse;
import com.ragab.booking.common.response.PageResponse;
import com.ragab.booking.config.security.userdetails.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RestController
@RequestMapping("/bookings")
@PreAuthorize("hasRole('USER')")
@SecurityRequirement(name = "Bearer Authentication")
public class BookController {
    private final BookingService bookingService;

    @Operation(summary = "Get booked events for a user", description = "Fetches a paginated list of booked events")
    @GetMapping
    public ResponseEntity<PageResponse<BookedResponse>> getBookings(
            @RequestParam(name = "page", defaultValue = "0", required = false) int page,
            @RequestParam(name = "size", defaultValue = "10", required = false) int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = userPrincipal.user().getId();
        return ResponseEntity.ok(bookingService.getBookings(userId, page, size));
    }

    @Operation(summary = "Get booked event details for a user", description = "Fetches the booked event details")
    @GetMapping("/{bookingId}")
    public ResponseEntity<EventResponse> getBookedEvent(
            @PathVariable Integer bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = userPrincipal.user().getId();
        return ResponseEntity.ok(bookingService.getBookedEvent(userId, bookingId));
    }

    @Operation(summary = "Book an event", description = "Allows users to book an event")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Event booked successfully"),
            @ApiResponse(responseCode = "400", description = "Event has already been booked"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PostMapping("/{eventId}/book")
    public ResponseEntity<?> bookEvent(
            @PathVariable Integer eventId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Integer userId = userPrincipal.user().getId();
        Integer bookingId = bookingService.bookEvent(userId, eventId);
        return ResponseEntity.created(URI.create("api/v1/event/" + bookingId + "/booked")).build();
    }

    @Operation(summary = "Cancel a booking", description = "Allows users to cancel their booking for an event")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Booking canceled successfully"),
            @ApiResponse(responseCode = "404", description = "Booking not found"),
            @ApiResponse(responseCode = "403", description = "Unauthorized to cancel this booking"),
            @ApiResponse(responseCode = "400", description = "Event has already passed")
    })
    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasRole('USER')")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Integer bookingId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        bookingService.cancelBooking(userPrincipal.user().getId(), bookingId);
        return ResponseEntity.noContent().build();
    }
}
