package com.ragab.booking.common.exception.handler;

import com.ragab.booking.common.exception.custom.*;
import com.ragab.booking.common.exception.custom.user.InvalidAgeException;
import com.ragab.booking.common.exception.custom.user.InvalidGenderException;
import com.ragab.booking.common.exception.custom.user.InvalidPasswordException;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.context.MessageSourceResolvable;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import static com.ragab.booking.common.exception.handler.BusinessErrorCode.*;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FileValidationException.class)
    public ResponseEntity<ExceptionResponse> handleFileValidationException(FileValidationException ex) {
        log.warn("File validation failed: {}", ex.getMessage());
        return buildErrorResponse(FILE_VALIDATION_ERROR, ex.getMessage(), null, null);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ExceptionResponse> handleHandlerMethodValidationException(HandlerMethodValidationException ex) {
        Set<String> validationErrors = ex.getValueResults().stream()
                .flatMap(result -> result.getResolvableErrors().stream())
                .map(MessageSourceResolvable::getDefaultMessage)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, String> fieldErrors = ex.getValueResults().stream()
                .collect(Collectors.toMap(
                        result -> result.getMethodParameter().getParameterName(),
                        result -> result.getResolvableErrors().stream()
                                .findFirst()
                                .map(MessageSourceResolvable::getDefaultMessage)
                                .orElse("Invalid value"),
                        (existing, replacement) -> existing
                ));

        return buildErrorResponse(
                VALIDATION_ERROR,
                "Validation failed for submitted data",
                validationErrors,
                fieldErrors
        );
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        log.warn("User not found: {}", ex.getMessage());
        return buildErrorResponse(
                USER_NOT_FOUND,
                ex.getMessage(),
                null,
                Map.of("user", "User not found")
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Invalid argument: {}", ex.getMessage());
        return buildErrorResponse(
                INVALID_ARGUMENT,
                ex.getMessage(),
                null,
                Map.of("argument", "Invalid value provided")
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Set<String> validationErrors = ex.getBindingResult().getAllErrors().stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Invalid value",
                        (existing, replacement) -> existing
                ));

        return buildErrorResponse(
                VALIDATION_ERROR,
                "Validation failed for submitted data",
                validationErrors,
                fieldErrors
        );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleEntityNotFoundException(EntityNotFoundException ex) {
        log.warn("Entity not found: {}", ex.getMessage());
        return buildErrorResponse(
                ENTITY_NOT_FOUND,
                ex.getMessage(),
                null,
                Map.of("entity", "Requested entity not found")
        );
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleEmailExistsException(EmailAlreadyExistsException ex) {
        log.warn("Email already exists: {}", ex.getMessage());
        Map<String, String> errors = Map.of("email", "Email address is already registered");
        return buildErrorResponse(EMAIL_ALREADY_EXISTS, ex.getMessage(), null, errors);
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ExceptionResponse> handleLockedException(LockedException ex) {
        log.warn("Account locked: {}", ex.getMessage());
        return buildErrorResponse(
                ACCOUNT_LOCKED,
                ex.getMessage(),
                null,
                Map.of("account", "Account is locked")
        );
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ExceptionResponse> handleDisabledException(DisabledException ex) {
        log.warn("Account disabled: {}", ex.getMessage());
        return buildErrorResponse(
                ACCOUNT_DISABLED,
                ex.getMessage(),
                null,
                Map.of("account", "Account is disabled")
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ExceptionResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        String message = ex.getMostSpecificCause().getMessage();

        log.error("Database integrity violation: {}", message);
        return buildErrorResponse(
                BusinessErrorCode.INTERNAL_ERROR,
                "An unexpected database error occurred",
                null,
                null
        );
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ExceptionResponse> handleMissingServletRequestPartException(MissingServletRequestPartException ex) {
        log.warn("Missing required file: {}", ex.getMessage());

        String partName = ex.getRequestPartName();
        Map<String, String> errors = Map.of(
                partName, String.format("The file '%s' is required", partName)
        );

        return buildErrorResponse(
                FILE_VALIDATION_ERROR,
                "Missing required file upload part",
                null,
                errors
        );
    }


    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleBadCredentialsException(BadCredentialsException ex) {
        log.warn("Bad credentials: {}", ex.getMessage());
        return buildErrorResponse(
                BAD_CREDENTIALS,
                ex.getMessage(),
                null,
                Map.of("credentials", "Invalid email or password")
        );
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidPasswordException(InvalidPasswordException ex) {
        log.warn("Invalid Password attempt: {}", ex.getMessage());
        return buildErrorResponse(
                INVALID_PASSWORD,
                ex.getMessage(),
                null,
                Map.of("password", "The provided password is incorrect"));
    }

    @ExceptionHandler({InvalidGenderException.class, InvalidAgeException.class})
    public ResponseEntity<ExceptionResponse> handleCustomValidationException(Exception ex) {
        log.warn("Validation error: {}", ex.getMessage());
        return buildErrorResponse(
                VALIDATION_ERROR,
                ex.getMessage(),
                Set.of(ex.getMessage()),
                null
        );
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidTokenException(InvalidTokenException ex) {
        log.warn("Invalid token: {}", ex.getMessage());
        return buildErrorResponse(
                INVALID_TOKEN,
                ex.getMessage(),
                null,
                Map.of("token", "Token is invalid or malformed")
        );
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ExceptionResponse> handleTokenExpiredException(TokenExpiredException ex) {
        log.warn("Token expired: {}", ex.getMessage());
        return buildErrorResponse(
                TOKEN_EXPIRED,
                ex.getMessage(),
                null,
                Map.of("token", "Token has expired")
        );
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ExceptionResponse> handleAuthorizationDeniedException(AuthorizationDeniedException ex) {
        log.warn("Authorization denied: {}", ex.getMessage());
        return buildErrorResponse(
                AUTHORIZATION_DENIED,
                "You don't have sufficient permissions to access this resource",
                null,
                Map.of("authorization", "Access denied")
        );
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidRefreshTokenException(InvalidRefreshTokenException ex) {
        log.warn("Invalid refresh token: {}", ex.getMessage());
        return buildErrorResponse(
                INVALID_REFRESH_TOKEN,
                ex.getMessage(),
                null,
                Map.of("refreshToken", "Invalid refresh token")
        );
    }


    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<ExceptionResponse> handleUnauthorizedShopAccessException(UnAuthorizedException ex) {
        log.warn("Unauthorized access to shop: {}", ex.getMessage());
        return buildErrorResponse(
                UNAUTHORIZED_ACCESS,
                ex.getMessage(),
                null,
                Map.of("shop", "You don't have permission to modify this shop")
        );
    }

    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ExceptionResponse> handleFileUploadException(FileUploadException ex) {
        log.error("File upload failed: {}", ex.getMessage());
        return buildErrorResponse(
                FILE_UPLOAD_ERROR,
                "Error occurred while uploading shop assets",
                null,
                Map.of("file", "Failed to process uploaded file")
        );
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleUnexpectedException(Exception ex) {
        if (ex instanceof MessagingException) {
            log.error("Email sending failed: {}", ex.getMessage());
            return buildErrorResponse(
                    INTERNAL_ERROR,
                    "Failed to send email",
                    null,
                    Map.of("email", "Failed to send email")
            );
        }

        log.error("Unexpected error occurred", ex);
        return buildErrorResponse(
                INTERNAL_ERROR,
                "An unexpected error occurred",  // Don't expose internal error details
                null,
                null
        );
    }

    private ResponseEntity<ExceptionResponse> buildErrorResponse(
            BusinessErrorCode errorCode,
            String details,
            Set<String> validationErrors,
            Map<String, String> errors) {
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(ExceptionResponse.builder()
                        .code(errorCode.getCode())
                        .message(errorCode.getDescription())
                        .details(details)
                        .validationErrors(validationErrors)
                        .errors(errors)
                        .build()
                );
    }
}