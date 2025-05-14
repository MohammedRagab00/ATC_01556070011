package com.ragab.booking;

import com.ragab.booking.core.category.model.Category;
import com.ragab.booking.core.category.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableAsync
public class EpicGatherApplication {

    public static void main(String[] args) {
        SpringApplication.run(EpicGatherApplication.class, args);
    }

//    @Bean
    public CommandLineRunner commandLineRunner(
            CategoryRepository categoryRepository
    ) {
        return args -> {
            if (!categoryRepository.existsByNameIgnoreCase("Sports")) {
                categoryRepository.save(new Category("Sports"));
            }
        };
    }
}
