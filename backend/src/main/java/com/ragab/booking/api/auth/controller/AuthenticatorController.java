package com.ragab.booking.api.auth.controller;

import com.ragab.booking.api.auth.dto.AuthenticationRequest;
import com.ragab.booking.api.auth.dto.AuthenticationResponse;
import com.ragab.booking.api.auth.dto.RefreshTokenRequest;
import com.ragab.booking.api.auth.dto.RegistrationRequest;
import com.ragab.booking.api.auth.service.AuthenticationService;
import com.ragab.booking.common.exception.handler.ExceptionResponse;
import com.ragab.booking.infrastructure.email.dto.ForgotPasswordRequest;
import com.ragab.booking.infrastructure.email.dto.ResetPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management API")
public class AuthenticatorController {

    private final AuthenticationService service;

    @Operation(
            summary = "Register a new user",
            description = "Registers a new user and sends an activation email"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "202", description = "Registration successful, activation email sent"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid registration details",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Email already registered",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid RegistrationRequest request
    ) throws MessagingException {
        service.register(request);
        return ResponseEntity.accepted().build();
    }

    @Operation(
            summary = "Authenticate user",
            description = "Authenticates a user and returns JWT tokens"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication successful",
                    content = @Content(schema = @Schema(implementation = AuthenticationResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid request",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Account locked or disabled",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @Operation(
            summary = "Activate user account",
            description = "Activates a user account using the token sent via email"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Account activated successfully"),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired token",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam("token") String token
    ) throws MessagingException {
        service.activateAccount(token);
    }

    @Operation(
            summary = "Refresh authentication token",
            description = "Gets a new access token using a valid refresh token"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Token refreshed successfully",
                    content = @Content(schema = @Schema(implementation = AuthenticationResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired refresh token",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthenticationResponse> refreshToken(
            @RequestBody
            @Valid
            RefreshTokenRequest request
    ) {
        return ResponseEntity.ok(service.refreshToken(request.refreshToken()));
    }

    @Operation(
            summary = "Initiate password reset",
            description = "Sends a password reset link to the user's email"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "202",
                    description = "Password reset email sent"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Email not found",
                    content = @Content(schema = @Schema(implementation = ExceptionResponse.class))
            )
    })
    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> forgotPassword(
            @RequestBody @Valid ForgotPasswordRequest request
    ) throws MessagingException {
        service.forgotPassword(request.email());
        return ResponseEntity.accepted().build();
    }

    @Operation(
            summary = "Reset password",
            description = "Resets user password using the token received via email"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successful"),
            @ApiResponse(responseCode = "400", description = "Invalid or expired token")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("token") String token,
            @RequestBody @Valid ResetPasswordRequest request
    ) {
        service.resetPassword(token, request.password());
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Logout user",
            description = "Invalidates the refresh token"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Logout successful"),
            @ApiResponse(responseCode = "400", description = "Invalid refresh token")
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestBody
            @Valid
            RefreshTokenRequest request
    ) {
        service.logout(request.refreshToken());
        return ResponseEntity.ok().build();
    }
}
