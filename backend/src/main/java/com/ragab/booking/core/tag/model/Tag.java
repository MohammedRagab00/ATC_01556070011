package com.ragab.booking.core.tag.model;

import com.ragab.booking.common.model.AuditableEntity;
import com.ragab.booking.core.event.model.Event;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "tags")
public class Tag extends AuditableEntity {
    @Column(length = 50, nullable = false, unique = true)
    String name;
}
