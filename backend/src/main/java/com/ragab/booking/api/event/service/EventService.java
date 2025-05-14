package com.ragab.booking.api.event.service;

import com.ragab.booking.api.event.dto.EventResponse;
import com.ragab.booking.common.response.PageResponse;
import com.ragab.booking.core.event.mapper.EventMapper;
import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ragab.booking.core.event.specification.EventSpecification.inFuture;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;


    @Transactional(readOnly = true)
    public PageResponse<EventResponse> getEvents(int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<Event> events = eventRepository.findAll(inFuture(), pageable);

        List<EventResponse> eventResponse = events.stream()
                .map(eventMapper::toResponse)
                .toList();
        return new PageResponse<>(
                eventResponse,
                events.getNumber(),
                events.getSize(),
                events.getTotalElements(),
                events.getTotalPages(),
                events.isFirst(),
                events.isLast()
        );
    }
}
