package com.ragab.booking.api.admin.controller;

import com.ragab.booking.api.admin.dto.event.EventRequest;
import com.ragab.booking.api.admin.service.AdminEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RestController
@RequestMapping("/admin/event")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEventController {
    private final AdminEventService adminEventService;

    @PostMapping
    public ResponseEntity<Integer> createEvent(
            @RequestBody @Valid EventRequest eventData
    ) {
        Integer eventId = adminEventService.createEvent(eventData);
        return ResponseEntity.created(URI.create("/api/v1/event" + eventId)).body(eventId);
    }

}
