package com.eventapp.controller;

import com.eventapp.dto.EventRequest;
import com.eventapp.dto.EventResponse;
import com.eventapp.dto.ParticipantResponse;
import com.eventapp.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final EventService eventService;

    @PostMapping("/events")
    public ResponseEntity<EventResponse> createEvent(@RequestBody EventRequest request, Authentication authentication) {
        String adminEmail = authentication.getName();
        return ResponseEntity.ok(eventService.createEvent(request, adminEmail));
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getAdminEvents(Authentication authentication) {
        String adminEmail = authentication.getName();
        return ResponseEntity.ok(eventService.getAdminEvents(adminEmail));
    }

    @GetMapping("/events/{eventId}/participants")
    public ResponseEntity<List<ParticipantResponse>> getParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getEventParticipants(eventId));
    }

    @PutMapping("/events/{eventId}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long eventId,
            @RequestBody EventRequest request,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        return ResponseEntity.ok(eventService.updateEvent(eventId, request, adminEmail));
    }

    @PutMapping("/events/{eventId}/close")
    public ResponseEntity<EventResponse> closeEvent(@PathVariable Long eventId, Authentication authentication) {
        String adminEmail = authentication.getName();
        return ResponseEntity.ok(eventService.closeEvent(eventId, adminEmail));
    }

    @PutMapping("/registrations/{registrationId}/verify")
    public ResponseEntity<String> verifyRegistration(
            @PathVariable Long registrationId,
            @RequestParam boolean verified,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        eventService.verifyRegistration(registrationId, verified, adminEmail);
        return ResponseEntity.ok("Registration status updated successfully");
    }

    @PostMapping("/registrations/{registrationId}/grant-certificate")
    public ResponseEntity<String> grantCertificate(
            @PathVariable Long registrationId,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        eventService.grantCertificate(registrationId, adminEmail);
        return ResponseEntity.ok("Certificate granted successfully");
    }
}
