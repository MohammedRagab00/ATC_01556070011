package com.ragab.booking.core.event.model;

import com.ragab.booking.common.model.AuditableEntity;
import com.ragab.booking.core.booking.model.Booking;
import com.ragab.booking.core.category.model.Category;
import com.ragab.booking.core.tag.model.Tag;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.hibernate.annotations.OnDeleteAction.SET_NULL;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "events")
public class Event extends AuditableEntity {
    @Column(length = 50, nullable = false)
    private String name;
    @Column
    private String description;
    @Column(name = "date")
    private LocalDateTime eventDate;
    private String imageUrl;
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    @Column(nullable = false)
    private String venue;

    @OneToMany(mappedBy = "event", cascade = CascadeType.MERGE)
    private Set<Booking> bookings = new HashSet<>();

    @ManyToOne(cascade = CascadeType.PERSIST)
    @OnDelete(action = SET_NULL)
    private Category category;

    @ManyToMany
    @JoinTable(name = "event_tags",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    public boolean isUpcoming() {
        return eventDate.isAfter(LocalDateTime.now());
    }
}
