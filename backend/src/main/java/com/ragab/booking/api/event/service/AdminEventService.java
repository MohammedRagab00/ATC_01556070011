package com.ragab.booking.api.event.service;

import com.ragab.booking.api.event.dto.EventRequest;
import com.ragab.booking.core.category.model.Category;
import com.ragab.booking.core.category.repository.CategoryRepository;
import com.ragab.booking.core.event.mapper.EventMapper;
import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.event.repository.EventRepository;
import com.ragab.booking.core.tag.model.Tag;
import com.ragab.booking.core.tag.repository.TagRepository;
import com.ragab.booking.infrastructure.azure.EventImageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class AdminEventService {
    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final EventMapper eventMapper;
    private final TagRepository tagRepository;
    private final EventImageService eventImageService;


    @Transactional
    public Integer createEvent(EventRequest eventData) {
        Event event = eventMapper.toEntity(eventData);
        Category category = getCategoryByName(eventData.category());
        event.setCategory(category);
        return eventRepository.saveAndFlush(event).getId();
    }

    @Transactional
    public void updateEvent(Integer eventId, EventRequest eventData) {
        Event event = getEventById(eventId);
        Category category = getCategoryByName(eventData.category());
        event.setCategory(category);
        updateEvent(event, eventData);

        eventRepository.save(event);
    }

    @Transactional
    public void addTagToEvent(Integer eventId, String tagName) {
        Event event = getEventById(eventId);
        Tag tag = tagRepository.findByNameIgnoreCase(tagName)
                .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));

        if (event.getTags().contains(tag)) {
            throw new IllegalArgumentException("Tag already exists for the event");
        }

        event.getTags().add(tag);

        eventRepository.save(event);
    }

    public void updatePhoto(Integer eventId, MultipartFile file) {
        eventImageService.updateEventImage(eventId, file);
    }

    @Transactional
    public void deleteEvent(Integer eventId) {
        Event event = getEventById(eventId);

        eventImageService.deleteEventImage(eventId);

        eventRepository.delete(event);
    }


    private Event getEventById(Integer eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
    }

    private Category getCategoryByName(String categoryName) {
        return categoryRepository.findByNameIgnoreCase(categoryName)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
    }

    private void updateEvent(Event event, EventRequest eventData) {
        event.setName(eventData.name());
        event.setDescription(eventData.description());
        event.setEventDate(eventData.eventDate());
        event.setPrice(eventData.price());
        event.setVenue(eventData.venue());
    }
}
