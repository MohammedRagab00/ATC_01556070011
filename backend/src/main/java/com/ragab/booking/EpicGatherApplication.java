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
            categoryRepository.save(new Category("Sports"));
            categoryRepository.save(new Category("Music"));
            categoryRepository.save(new Category("Conference"));
            categoryRepository.save(new Category("Workshop"));
            categoryRepository.save(new Category("Festival"));
            categoryRepository.save(new Category("Networking"));
            categoryRepository.save(new Category("Party"));
            categoryRepository.save(new Category("Seminar"));
            categoryRepository.save(new Category("Exhibition"));
            categoryRepository.save(new Category("Comedy"));
            categoryRepository.save(new Category("Theater"));
            categoryRepository.save(new Category("Family"));
            categoryRepository.save(new Category("Food & Drink"));
            categoryRepository.save(new Category("Charity"));
            categoryRepository.save(new Category("Technology"));
        };
    }
}
