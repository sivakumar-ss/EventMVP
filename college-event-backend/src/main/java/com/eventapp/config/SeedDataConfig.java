package com.eventapp.config;

import com.eventapp.entity.Event;
import com.eventapp.entity.EventStatus;
import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.repository.EventRepository;
import com.eventapp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class SeedDataConfig {

    @Bean
    @Order(2)
    public CommandLineRunner seedEvents(EventRepository eventRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Master Admin if not exists
            if (userRepository.findByEmail("masteradmin@eventhub.com").isEmpty()) {
                User masterAdmin = User.builder()
                        .name("Master Admin")
                        .email("masteradmin@eventhub.com")
                        .password(passwordEncoder.encode("master123"))
                        .collegeName("EventHub Platform")
                        .role(Role.ROLE_MASTER_ADMIN)
                        .build();
                userRepository.save(masterAdmin);
                System.out.println("Default master admin created: masteradmin@eventhub.com / master123");
            }

            // Seed Admin if not exists
            User admin = userRepository.findByEmail("admin@nexusevents.com").orElse(null);
            if (admin == null) {
                admin = User.builder()
                        .name("College Admin")
                        .email("admin@nexusevents.com")
                        .password(passwordEncoder.encode("admin123"))
                        .collegeName("NexusEvents National Institute")
                        .role(Role.ROLE_ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("Default admin created: admin@nexusevents.com / admin123");
            }

            // Technical Event
            if (!eventRepository.existsByTitle("Cyber Hackathon 2026")) {
                eventRepository.save(Event.builder()
                        .title("Cyber Hackathon 2026")
                        .description("Join us for a 24-hour coding challenge to solve real-world problems. Great prizes for winners!")
                        .venue("Tech Auditorium, Block A")
                        .eventDate(LocalDateTime.now().plusDays(10).withHour(9).withMinute(0))
                        .category("Technical")
                        .maxParticipants(50)
                        .status(EventStatus.UPCOMING)
                        .admin(admin)
                        .image("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80")
                        .build());
            }

            // Cultural Event
            if (!eventRepository.existsByTitle("Spring Cultural Fest")) {
                eventRepository.save(Event.builder()
                        .title("Spring Cultural Fest")
                        .description("A celebration of music, dance, and art. Experience the vibrant culture of our campus.")
                        .venue("Open Theater, Central Park")
                        .eventDate(LocalDateTime.now().plusDays(15).withHour(17).withMinute(30))
                        .category("Cultural")
                        .maxParticipants(200)
                        .status(EventStatus.UPCOMING)
                        .admin(admin)
                        .image("https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80")
                        .build());
            }

            // Sports Event
            if (!eventRepository.existsByTitle("Inter-College Cricket Cup")) {
                eventRepository.save(Event.builder()
                        .title("Inter-College Cricket Cup")
                        .description("The ultimate showdown for cricket lovers. Represent your department and win the trophy.")
                        .venue("University Sports Ground")
                        .eventDate(LocalDateTime.now().plusDays(20).withHour(8).withMinute(0))
                        .category("Sports")
                        .maxParticipants(100)
                        .status(EventStatus.UPCOMING)
                        .admin(admin)
                        .image("https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80")
                        .build());
            }

            // Workshop Event
            if (!eventRepository.existsByTitle("AI & Web3 Workshop")) {
                eventRepository.save(Event.builder()
                        .title("AI & Web3 Workshop")
                        .description("Master the future technologies. Hand-on training on LLMs and Blockchain.")
                        .venue("Computer Lab 4, IT Block")
                        .eventDate(LocalDateTime.now().plusDays(5).withHour(10).withMinute(0))
                        .category("Workshop")
                        .maxParticipants(30)
                        .status(EventStatus.UPCOMING)
                        .admin(admin)
                        .image("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80")
                        .build());
            }

            System.out.println("Categorized events checked/seeded successfully.");
        };
    }
}
