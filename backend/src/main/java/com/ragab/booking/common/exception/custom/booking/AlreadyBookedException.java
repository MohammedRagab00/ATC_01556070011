package com.ragab.booking.common.exception.custom.booking;

public class AlreadyBookedException extends RuntimeException {
    public AlreadyBookedException(String message) {
        super(message);
    }
}
