package com.ragab.booking.api.admin.service;

import com.ragab.booking.api.admin.dto.event.EventRequest;
import com.ragab.booking.core.category.model.Category;
import com.ragab.booking.core.category.repository.CategoryRepository;
import com.ragab.booking.core.event.mapper.EventMapper;
import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.event.repository.EventRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class AdminEventService {
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final EventMapper eventMapper;


    @Transactional
    public Integer createEvent(EventRequest eventData) {
        Event event = eventMapper.toEntity(eventData);
        Category category = categoryRepository.findByNameIgnoreCase(eventData.category())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        event.setCategory(category);
        return eventRepository.saveAndFlush(event).getId();
    }

}
