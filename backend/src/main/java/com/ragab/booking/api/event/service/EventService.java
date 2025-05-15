package com.ragab.booking.api.event.service;

import com.ragab.booking.api.event.dto.BookedResponse;
import com.ragab.booking.api.event.dto.EventResponse;
import com.ragab.booking.common.exception.custom.UnAuthorizedException;
import com.ragab.booking.common.exception.custom.booking.AlreadyBookedException;
import com.ragab.booking.common.exception.custom.booking.EventPassedException;
import com.ragab.booking.common.response.PageResponse;
import com.ragab.booking.core.booking.mapper.BookingMapper;
import com.ragab.booking.core.booking.model.Booking;
import com.ragab.booking.core.booking.repository.BookingRepository;
import com.ragab.booking.core.event.mapper.EventMapper;
import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.event.repository.EventRepository;
import com.ragab.booking.core.user.model.Users;
import com.ragab.booking.core.user.repository.UserRepository;
import com.ragab.booking.infrastructure.azure.EventImageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.ragab.booking.core.event.specification.EventSpecification.inFuture;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class EventService {
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;
    private final BookingMapper bookingMapper;
    private final EventImageService eventImageService;


    @Transactional(readOnly = true)
    public PageResponse<EventResponse> getEvents(int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<Event> events = eventRepository.findAll(inFuture(), pageable);

        List<EventResponse> eventResponse = events.stream()
                .map(event ->
                        eventMapper.toResponse(
                                event,
                                eventImageService.getImageUrl(event.getImageUrl())
                        )
                ).toList();
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

    @Transactional(readOnly = true)
    public EventResponse getEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        return eventMapper.toResponse(event, eventImageService.getImageUrl(event.getImageUrl()));
    }

    public Integer bookEvent(Integer userId, Integer eventId) {
        Users user = findUserById(userId);

        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) {
            throw new EntityNotFoundException("Event not found");
        } else if (!event.isUpcoming()) {
            throw new EventPassedException("Event passed: cannot book");
        }
        Booking booking = bookingRepository.findByUser_IdAndEvent_Id(userId, eventId);
        if (booking != null) {
            throw new AlreadyBookedException("Event is already booked");
        }

        return bookingRepository.saveAndFlush(Booking.builder()
                .user(user)
                .event(event)
                .build()
        ).getId();
    }

    @Transactional
    public void cancelBooking(Integer userId, Integer bookingId) {
        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new UnAuthorizedException("You are not authorized to cancel this booking");
        }

        Event event = booking.getEvent();
        if (event == null) {
            throw new EntityNotFoundException("There is an issue with this event, please contact support");
        }

        if (!event.isUpcoming()) {
            throw new EventPassedException("Event passed: cannot cancel booking");
        }

        bookingRepository.delete(booking);
    }

    @Transactional(readOnly = true)
    public PageResponse<BookedResponse> getBookedEvents(Integer userId, int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<Booking> bookings = bookingRepository.findAllByUser_Id(userId, pageable);

        List<BookedResponse> bookedResponses = bookings.stream()
                .map(bookingMapper::toResponse)
                .toList();
        return new PageResponse<>(
                bookedResponses,
                bookings.getNumber(),
                bookings.getSize(),
                bookings.getTotalElements(),
                bookings.getTotalPages(),
                bookings.isFirst(),
                bookings.isLast()
        );
    }

    @Transactional(readOnly = true)
    public EventResponse getBookedEvent(Integer userId, Integer bookingId) {
        Users user = findUserById(userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new UnAuthorizedException("You are not authorized to view this booking");
        }
        Event event = booking.getEvent();
        return eventMapper.toResponse(event, eventImageService.getImageUrl(event.getImageUrl()));
    }

    private Users findUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


}
