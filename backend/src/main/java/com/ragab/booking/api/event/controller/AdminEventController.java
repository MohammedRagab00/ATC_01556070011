package com.ragab.booking.api.event.controller;

import com.ragab.booking.api.event.dto.AddTagRequest;
import com.ragab.booking.api.event.dto.EventRequest;
import com.ragab.booking.api.event.service.AdminEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Tag(name = "Admin Events", description = "Endpoints for event administration, including creation, updates, and tagging")
@RestController
@RequestMapping("/admin/event")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminEventController {
    private final AdminEventService adminEventService;

    @Operation(summary = "Create a new event", description = "Creates an event and returns its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Event created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid event data"),
            @ApiResponse(responseCode = "403", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<Integer> createEvent(
            @RequestBody @Valid EventRequest eventData
    ) {
        Integer eventId = adminEventService.createEvent(eventData);
        return ResponseEntity.created(URI.create("/api/v1/event/" + eventId)).body(eventId);
    }

    @Operation(summary = "Update an event", description = "Modifies event details")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Event updated successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "400", description = "Invalid event data")
    })
    @PutMapping("/{eventId}/update")
    public ResponseEntity<Integer> updateEvent(
            @PathVariable Integer eventId,
            @RequestBody @Valid EventRequest eventData
    ) {
        adminEventService.updateEvent(eventId, eventData);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Add a tag to an event", description = "Assigns a tag to an event")
    @PatchMapping("/{eventId}/add-tag")
    public ResponseEntity<Void> addTagToEvent(
            @PathVariable Integer eventId,
            @RequestBody AddTagRequest addTagRequest
    ) {
        adminEventService.addTagToEvent(eventId, addTagRequest.tagName());
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Upload event photo", description = "Upload or update the event's photo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Photo uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file type or size"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PutMapping("/{eventId}/photo")
    public ResponseEntity<Void> updatePhoto(
            @PathVariable Integer eventId,
            @RequestParam("file") MultipartFile file
    ) {
        adminEventService.updatePhoto(eventId, file);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete an event", description = "Removes an event from the system")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Event not found"),
            @ApiResponse(responseCode = "403", description = "Unauthorized")
    })
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Integer eventId
    ) {
        adminEventService.deleteEvent(eventId);
        return ResponseEntity.noContent().build();
    }
}
