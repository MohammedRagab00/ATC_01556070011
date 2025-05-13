package com.ragab.booking.common.audit;

import com.ragab.booking.config.security.userdetails.UserPrincipal;
import org.springframework.data.domain.AuditorAware;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class ApplicationAuditAware implements AuditorAware<Integer> {
    @Override
    @NonNull
    public Optional<Integer> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken
        ) {
            return Optional.empty();
        }
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return Optional.of(userPrincipal.user().getId());
    }
}