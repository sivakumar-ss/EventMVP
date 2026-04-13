package com.eventapp.controller;

import com.eventapp.dto.EventResponse;
import com.eventapp.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final EventService eventService;

    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<String> registerForEvent(@PathVariable Long eventId, Authentication authentication) {
        String studentEmail = authentication.getName();
        eventService.registerForEvent(eventId, studentEmail);
        return ResponseEntity.ok("Successfully registered for the event");
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<EventResponse>> getMyRegistrations(Authentication authentication) {
        String studentEmail = authentication.getName();
        return ResponseEntity.ok(eventService.getStudentRegistrations(studentEmail));
    }
}
