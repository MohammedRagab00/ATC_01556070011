package com.ragab.booking.core.user.model;

import com.ragab.booking.common.exception.custom.user.InvalidAgeException;
import com.ragab.booking.common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
public class Users extends BaseEntity {
    @Column(length = 20, nullable = false)
    private String firstname;
    @Column(length = 20, nullable = false)
    private String lastname;
    @Column(unique = true, length = 50, nullable = false, updatable = false)
    private String email;
    @Column(name = "password_hash")
    private String password;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dob;
    @Column(name = "profile_picture_url")
    private String photo;
    private Gender gender;

    private boolean isAdmin;
    private boolean enabled;

    public String getName() {
        return firstname + " " + lastname;
    }

    @PrePersist
    @PreUpdate
    private void validateAge() {
        if (dob != null &&
                ChronoUnit.YEARS.between(dob, LocalDate.now()) < 13) {
            throw new InvalidAgeException("User must be at least 13 years old");
        }
    }

    public int calculateAge() {
        return Period.between(dob, LocalDate.now()).getYears();
    }
}