package com.ragab.booking.core.user.mapper;

import com.ragab.booking.api.user.dto.UserProfileResponse;
import com.ragab.booking.api.user.dto.UserSearchResponse;
import com.ragab.booking.core.user.model.Users;
import com.ragab.booking.infrastructure.azure.ProfilePhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Component
public class UserMapper {
    private final ProfilePhotoService profilePhotoService;

    public UserProfileResponse toProfileResponse(Users user) {
        return new UserProfileResponse(
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getGender(),
                user.calculateAge(),
                user.getDob(),
                profilePhotoService.getPhotoUrl(user.getPhoto())
        );
    }

    public UserSearchResponse toSearchResponse(Users user) {
        return new UserSearchResponse(
                user.getId(),
                user.getEmail(),
                user.isAdmin()
        );
    }
}
