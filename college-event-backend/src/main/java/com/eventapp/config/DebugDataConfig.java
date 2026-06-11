package com.eventapp.config;

import com.eventapp.repository.EventRepository;
import com.eventapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class DebugDataConfig {

    @Bean
    @Order(3)
    public CommandLineRunner debugData(EventRepository eventRepository, UserRepository userRepository) {
        return args -> {
            System.out.println("--- DEBUG DATA ---");
            System.out.println("User Count: " + userRepository.count());
            userRepository.findAll().forEach(u -> System.out.println("User: " + u.getEmail() + " (" + u.getRole() + ")"));
            
            System.out.println("Event Count: " + eventRepository.count());
            eventRepository.findAll().forEach(e -> System.out.println("Event: " + e.getTitle() + " (ID: " + e.getId() + ")"));
            System.out.println("--- END DEBUG ---");
        };
    }
}
