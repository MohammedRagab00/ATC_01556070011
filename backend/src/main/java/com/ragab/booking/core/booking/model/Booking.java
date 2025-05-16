package com.ragab.booking.core.booking.model;

import com.ragab.booking.common.model.AuditableEntity;
import com.ragab.booking.core.event.model.Event;
import com.ragab.booking.core.user.model.Users;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;

import static org.hibernate.annotations.OnDeleteAction.CASCADE;
import static org.hibernate.annotations.OnDeleteAction.SET_NULL;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "bookings")
public class Booking extends AuditableEntity {

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = CASCADE)
    private Users user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id")
    @OnDelete(action = SET_NULL)
    private Event event;
}
