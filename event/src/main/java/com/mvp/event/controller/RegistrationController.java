package com.mvp.event.controller;

import com.mvp.event.dto.response.EventResponse;
import com.mvp.event.dto.response.MessageResponse;
import com.mvp.event.dto.response.ParticipantResponse;
import com.mvp.event.security.UserDetailsImpl;
import com.mvp.event.service.CertificateService;
import com.mvp.event.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    private final CertificateService certificateService;

    /** Student – register for an event */
    @PostMapping("/events/{eventId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<MessageResponse> register(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(registrationService.register(userDetails.getUser().getId(), eventId));
    }

    /** Student – cancel registration */
    @DeleteMapping("/events/{eventId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<MessageResponse> cancel(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(registrationService.cancelRegistration(userDetails.getUser().getId(), eventId));
    }

    /** Student – my registered events */
    @GetMapping("/my-events")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EventResponse>> myEvents(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(registrationService.getRegisteredEvents(userDetails.getUser().getId()));
    }

    /** Admin / Student – participants per event */
    @GetMapping("/events/{eventId}/participants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ParticipantResponse>> getParticipants(@PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getParticipants(eventId));
    }

    /** Student – download certificate PDF */
    @GetMapping("/events/{eventId}/certificate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        byte[] pdf = certificateService.generateCertificate(userDetails.getUser().getId(), eventId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=certificate.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
