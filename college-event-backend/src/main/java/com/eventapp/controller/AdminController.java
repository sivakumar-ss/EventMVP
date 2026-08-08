package com.eventapp.controller;

import com.eventapp.dto.EventRequest;
import com.eventapp.dto.EventResponse;
import com.eventapp.dto.ParticipantResponse;
import com.eventapp.dto.ReportResponse;
import com.eventapp.dto.SupportTicketRequest;
import com.eventapp.dto.SupportTicketResponse;
import com.eventapp.entity.User;
import com.eventapp.repository.UserRepository;
import com.eventapp.service.EventService;
import com.eventapp.service.SupportTicketService;
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
    private final SupportTicketService supportTicketService;
    private final UserRepository userRepository;

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

    @GetMapping(value = "/events/{eventId}/participants/export", produces = "text/csv")
    public ResponseEntity<String> exportParticipantsCsv(@PathVariable Long eventId) {
        List<ParticipantResponse> participants = eventService.getEventParticipants(eventId);
        StringBuilder csv = new StringBuilder();
        csv.append("Name,Email,Role,Registered Date,Status,Certificate Granted\n");
        for (ParticipantResponse p : participants) {
            csv.append(p.getName() != null ? p.getName().replace(",", " ") : "").append(",")
               .append(p.getEmail() != null ? p.getEmail() : "").append(",")
               .append(p.getRole() != null ? p.getRole() : "").append(",")
               .append(p.getRegisteredDate() != null ? p.getRegisteredDate() : "").append(",")
               .append(p.getStatus() != null ? p.getStatus() : "").append(",")
               .append(p.isCertificateGranted() ? "Yes" : "No").append("\n");
        }
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"participants_" + eventId + ".csv\"")
                .body(csv.toString());
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

    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long eventId, Authentication authentication) {
        String adminEmail = authentication.getName();
        eventService.deleteEvent(eventId, adminEmail);
        return ResponseEntity.ok("Event deleted successfully");
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

    @PostMapping("/support-tickets")
    public ResponseEntity<String> createSupportTicket(@RequestBody SupportTicketRequest request, Authentication authentication) {
        User admin = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        supportTicketService.createTicket(admin, request);
        return ResponseEntity.ok("Support ticket created successfully");
    }

    @GetMapping("/support-tickets")
    public ResponseEntity<List<SupportTicketResponse>> getMySupportTickets(Authentication authentication) {
        User admin = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(supportTicketService.getAdminTickets(admin));
    }

    @GetMapping("/reports")
    public ResponseEntity<ReportResponse> getAdminReports(Authentication authentication) {
        String adminEmail = authentication.getName();
        return ResponseEntity.ok(eventService.getAdminReports(adminEmail));
    }
}
