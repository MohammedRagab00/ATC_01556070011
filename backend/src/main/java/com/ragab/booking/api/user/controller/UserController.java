package com.ragab.booking.api.user.controller;

import com.ragab.booking.api.user.dto.ChangePasswordRequest;
import com.ragab.booking.api.user.dto.UpdateProfileRequest;
import com.ragab.booking.api.user.dto.UserProfileResponse;
import com.ragab.booking.api.user.service.UserService;
import com.ragab.booking.config.security.userdetails.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RestController
@RequestMapping("/user")
@Tag(name = "User Profile", description = "Endpoints for managing user profile, photo and credentials")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Change user password", description = "Allows authenticated users to change their password")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid current password or password mismatch"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PatchMapping("/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> changePassword(
            @RequestBody @Valid ChangePasswordRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        userService.changePassword(principal.getUsername(), request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Update user profile", description = "Update user's profile information (name, gender, birth date)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid profile data"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateProfile(
            @RequestBody @Valid UpdateProfileRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        userService.updateProfile(principal.getUsername(), request);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get user profile", description = "Retrieve current user's profile information")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(userService.getUserProfile(principal.getUsername()));
    }

    @Operation(summary = "Upload profile photo", description = "Upload or update user's profile photo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Photo uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file type or size"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PutMapping("/photo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updatePhoto(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        userService.updatePhoto(principal.getUsername(), file);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Delete profile photo", description = "Remove user's current profile photo")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Photo deleted successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @DeleteMapping("/photo")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePhoto(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        userService.deletePhoto(principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}