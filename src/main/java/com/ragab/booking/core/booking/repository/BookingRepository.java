package com.ragab.booking.core.booking.repository;

import com.ragab.booking.core.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
}
