ALTER TABLE bookings
DROP
CONSTRAINT bookings_event_id_fkey;

ALTER TABLE bookings
    ADD CONSTRAINT bookings_event_id_fkey
        FOREIGN KEY (event_id)
            REFERENCES events (id)
            ON DELETE SET NULL;