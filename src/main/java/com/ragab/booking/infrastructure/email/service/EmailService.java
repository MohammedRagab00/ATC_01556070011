package com.ragab.booking.infrastructure.email.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Slf4j
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends an email asynchronously using a template
     *
     * @param to              Email recipient address
     * @param username        Username to display in the email
     * @param template        Template to use, or null for default
     * @param frontendUrl URL for the activation link
     * @param activationCode  Activation code for manual entry
     */
    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName template,
            String frontendUrl,
            String activationCode
    ) throws MessagingException {
        try {

            String subject = template.getDefaultSubject();

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MULTIPART_MODE_MIXED,
                    UTF_8.name()
            );

            Map<String, Object> properties = new HashMap<>();
            properties.put("username", username);
            properties.put("frontend_url", frontendUrl);
            properties.put("activation_code", activationCode);

            Context context = new Context();
            context.setVariables(properties);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            String htmlContent = templateEngine.process(template.getTemplateFileName(), context);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
            //todo - Consider implementing a retry mechanism or throwing a custom exception
            throw new MessagingException();
        }
    }
}