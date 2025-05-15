package com.ragab.booking.core.booking.repository;

import com.ragab.booking.core.booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    Booking findByUser_IdAndEvent_Id(Integer userId, Integer eventId);

    Page<Booking> findAllByUser_Id(Integer userId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.id = ?1")
    Optional<Booking> findByBookingId(Integer bookingId);
}
