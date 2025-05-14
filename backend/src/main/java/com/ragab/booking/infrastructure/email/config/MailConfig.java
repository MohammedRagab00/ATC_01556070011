package com.ragab.booking.infrastructure.email.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {
    @Value("${spring.mail.host}")
    private String host;
    @Value("${spring.mail.port}")
    private int port;
    @Value("${spring.mail.username}")
    private String username;
    @Value("${spring.mail.password}")
    private String password;
    @Value("${spring.mail.properties.mail.smtp.auth}")
    private String auth;
    @Value("${spring.mail.properties.mail.smtp.starttls.enable}")
    private String starttls;
    @Value("${spring.mail.properties.mail.smtp.ssl.trust}")
    private String trust;
    @Value("${spring.mail.properties.mail.smtp.ssl.protocols}")
    private String sslProtocols;
    @Value("${spring.mail.properties.mail.timeout}")
    private String timeout;
    @Value("${spring.mail.properties.mail.connectiontimeout}")
    private String connectionTimeout;
    @Value("${spring.mail.properties.mail.writetimeout}")
    private String writeTimeout;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = new Properties();
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", starttls);
        props.put("mail.smtp.timeout", timeout);
        props.put("mail.smtp.connectiontimeout", connectionTimeout);
        props.put("mail.smtp.writetimeout", writeTimeout);
        props.put("mail.smtp.ssl.trust", trust);
        props.put("mail.smtp.ssl.protocols", sslProtocols);
//        props.put("mail.debug", "true");

        mailSender.setJavaMailProperties(props);
        return mailSender;
    }
}
