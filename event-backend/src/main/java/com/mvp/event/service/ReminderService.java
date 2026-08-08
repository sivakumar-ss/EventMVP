package com.mvp.event.service;

import com.mvp.event.entity.Event;
import com.mvp.event.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

/**
 * Console-based reminder simulation.
 * In production, replace the log statements with actual email/SMS calls.
 */
@Service
@Slf4j
public class ReminderService {

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public void sendRegistrationConfirmation(User student, Event event) {
        log.info("====================================================");
        log.info("📧 [EMAIL SIMULATION] To: {} <{}>", student.getFullName(), student.getEmail());
        log.info("   Subject: Registration Confirmed – {}", event.getTitle());
        log.info("   Dear {},", student.getFullName());
        log.info("   You have successfully registered for:");
        log.info("     Event  : {}", event.getTitle());
        log.info("     Venue  : {}", event.getVenue());
        log.info("     Date   : {}", event.getEventDate().format(FORMATTER));
        log.info("   We look forward to seeing you there!");
        log.info("====================================================");
    }

    public void sendEventReminder(User student, Event event) {
        log.info("====================================================");
        log.info("🔔 [REMINDER SIMULATION] To: {} <{}>", student.getFullName(), student.getEmail());
        log.info("   Subject: Reminder – {} is Tomorrow!", event.getTitle());
        log.info("   Dear {},", student.getFullName());
        log.info("   This is a reminder that '{}' is scheduled tomorrow.", event.getTitle());
        log.info("   Venue: {} | Date: {}", event.getVenue(), event.getEventDate().format(FORMATTER));
        log.info("====================================================");
    }
}
