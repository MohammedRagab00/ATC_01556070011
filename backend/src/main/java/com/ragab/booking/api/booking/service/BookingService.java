package com.ragab.booking.api.booking.service;

import com.ragab.booking.api.booking.dto.BookedResponse;
import com.ragab.booking.common.exception.custom.UnAuthorizedException;
import com.ragab.booking.common.exception.custom.booking.AlreadyBookedException;
import com.ragab.booking.common.exception.custom.booking.EventPassedException;
import com.ragab.booking.common.response.PageResponse;
import com.ragab.booking.core.booking.mapper.BookingMapper;
import com.ragab.booking.core.booking.model.Booking;
import com.ragab.booking.core.booking.repository.BookingRepository;
import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.event.repository.EventRepository;
import com.ragab.booking.core.user.model.Users;
import com.ragab.booking.core.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public PageResponse<BookedResponse> getBookings(Integer userId, int page, int size) {
        Pageable pageable = Pageable.ofSize(size).withPage(page);
        Page<Booking> bookings = bookingRepository.findAllByUser_Id(userId, pageable);

        List<BookedResponse> bookedResponses = bookings.stream()
                .filter(booking -> booking.getEvent() != null)
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

    public Integer bookEvent(Integer userId, Integer eventId) {
        Users user = findUserById(userId);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));
        if (!event.isUpcoming()) {
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

    private Users findUserById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
