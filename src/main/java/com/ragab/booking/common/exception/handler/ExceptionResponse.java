package com.ragab.booking.common.exception.handler;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.Map;
import java.util.Set;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@Schema(name = "ExceptionResponse", description = "Error response structure")
@Builder
@JsonInclude(NON_NULL)
public record ExceptionResponse(
        @Schema(description = "Error code", example = "AUTH_001")
        Integer code,

        @Schema(description = "Error message", example = "Authentication failed")
        String message,

        @Schema(description = "Detailed error description", example = "Invalid email or password provided")
        String details,

        @Schema(description = "List of validation errors")
        Set<String> validationErrors,

        @Schema(description = "Field-specific errors")
        Map<String, String> errors
) {
}