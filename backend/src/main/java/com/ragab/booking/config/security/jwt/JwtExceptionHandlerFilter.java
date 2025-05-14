package com.ragab.booking.config.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ragab.booking.common.exception.handler.BusinessErrorCode;
import com.ragab.booking.common.exception.handler.ExceptionResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static com.ragab.booking.common.exception.handler.BusinessErrorCode.INVALID_JWT_SIGNATURE;
import static com.ragab.booking.common.exception.handler.BusinessErrorCode.TOKEN_EXPIRED;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Component
public class JwtExceptionHandlerFilter extends OncePerRequestFilter {
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException ex) {
            handleJwtException(response, TOKEN_EXPIRED, "Your session has expired. Please use the refresh token to get a new one.");
        } catch (SignatureException ex) {
            handleJwtException(response, INVALID_JWT_SIGNATURE, "Invalid token signature");
        }
    }

    private void handleJwtException(HttpServletResponse response, BusinessErrorCode errorCode, String details) throws IOException {
        ExceptionResponse errorResponse = ExceptionResponse.builder()
                .code(errorCode.getCode())
                .message(errorCode.getDescription())
                .details(details)
                .build();

        response.setStatus(UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
