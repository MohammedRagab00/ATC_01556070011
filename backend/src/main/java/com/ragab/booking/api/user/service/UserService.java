package com.ragab.booking.api.user.service;

import com.ragab.booking.api.user.dto.ChangePasswordRequest;
import com.ragab.booking.api.user.dto.UpdateProfileRequest;
import com.ragab.booking.api.user.dto.UserProfileResponse;
import com.ragab.booking.common.exception.custom.user.InvalidAgeException;
import com.ragab.booking.common.exception.custom.user.InvalidGenderException;
import com.ragab.booking.common.exception.custom.user.InvalidPasswordException;
import com.ragab.booking.core.user.mapper.UserMapper;
import com.ragab.booking.core.user.model.Gender;
import com.ragab.booking.core.user.model.Users;
import com.ragab.booking.core.user.repository.UserRepository;
import com.ragab.booking.infrastructure.azure.ProfilePhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProfilePhotoService profilePhotoService;
    private final UserMapper userMapper;

    public void changePassword(String email, ChangePasswordRequest request) {
        Users user = getUserByEmail(email);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    public void updateProfile(String email, UpdateProfileRequest request) {
        var user = getUserByEmail(email);

        user.setFirstname(request.firstname());
        user.setLastname(request.lastname());
        try {
            user.setGender(Gender.valueOf(request.gender().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new InvalidGenderException("Gender must be MALE, FEMALE, or PREFER_NOT_TO_SAY");
        }
        if (request.birthDate() != null) {
            validateAge(request.birthDate());
            user.setDob(request.birthDate());
        }

        userRepository.save(user);
    }

    public void updatePhoto(String email, MultipartFile file) {
        profilePhotoService.updateProfilePhoto(email, file);
    }

    public void deletePhoto(String email) {
        profilePhotoService.deleteProfilePhoto(email);
    }

    public UserProfileResponse getUserProfile(String email) {
        var user = getUserByEmail(email);

        return userMapper.toProfileResponse(user);
    }

    private Users getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private void validateAge(LocalDate birthDate) {
        if (birthDate.isAfter(LocalDate.now().minusYears(13))) {
            throw new InvalidAgeException("You must be at least 13 years old.");
        }
    }
}
