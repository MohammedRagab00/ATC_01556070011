package com.ragab.booking.infrastructure.email.service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account", "Account Activation"),
    RESET_PASSWORD("reset_password", "Password Reset");

    private final String templateFileName;
    private final String defaultSubject;

}
