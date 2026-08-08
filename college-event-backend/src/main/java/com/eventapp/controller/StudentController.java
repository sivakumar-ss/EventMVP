package com.eventapp.controller;

import com.eventapp.dto.EventResponse;
import com.eventapp.dto.StudentNetworkResponse;
import com.eventapp.dto.AdminRequestPayload;
import com.eventapp.dto.AdminRequestResponse;
import com.eventapp.dto.RegistrationRequest;
import com.eventapp.entity.User;
import com.eventapp.repository.UserRepository;
import com.eventapp.service.AdminVerificationService;
import com.eventapp.service.EventService;
import com.eventapp.service.StudentNetworkService;
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
    private final StudentNetworkService studentNetworkService;
    private final AdminVerificationService adminVerificationService;
    private final UserRepository userRepository;

    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<String> registerForEvent(
            @PathVariable Long eventId, 
            @RequestBody RegistrationRequest request, 
            Authentication authentication) {
        String studentEmail = authentication.getName();
        eventService.registerForEvent(eventId, studentEmail, request);
        return ResponseEntity.ok("Registration submitted successfully. Waiting for verification.");
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<EventResponse>> getMyRegistrations(Authentication authentication) {
        String studentEmail = authentication.getName();
        return ResponseEntity.ok(eventService.getStudentRegistrations(studentEmail));
    }

    @GetMapping("/network/students")
    public ResponseEntity<List<StudentNetworkResponse>> searchStudents(
            @RequestParam(required = false, defaultValue = "") String search,
            Authentication authentication) {
        String currentEmail = authentication.getName();
        return ResponseEntity.ok(studentNetworkService.searchStudents(currentEmail, search));
    }

    @PostMapping("/network/follow/{userId}")
    public ResponseEntity<String> followStudent(
            @PathVariable Long userId,
            Authentication authentication) {
        String currentEmail = authentication.getName();
        studentNetworkService.follow(currentEmail, userId);
        return ResponseEntity.ok("Followed student successfully.");
    }

    @PostMapping("/network/unfollow/{userId}")
    public ResponseEntity<String> unfollowStudent(
            @PathVariable Long userId,
            Authentication authentication) {
        String currentEmail = authentication.getName();
        studentNetworkService.unfollow(currentEmail, userId);
        return ResponseEntity.ok("Unfollowed student successfully.");
    }

    @GetMapping("/network/followers")
    public ResponseEntity<List<StudentNetworkResponse>> getFollowers(Authentication authentication) {
        String currentEmail = authentication.getName();
        return ResponseEntity.ok(studentNetworkService.getFollowers(currentEmail));
    }

    @GetMapping("/network/following")
    public ResponseEntity<List<StudentNetworkResponse>> getFollowing(Authentication authentication) {
        String currentEmail = authentication.getName();
        return ResponseEntity.ok(studentNetworkService.getFollowing(currentEmail));
    }

    @GetMapping("/network/summary")
    public ResponseEntity<StudentNetworkResponse> getNetworkSummary(Authentication authentication) {
        String currentEmail = authentication.getName();
        return ResponseEntity.ok(studentNetworkService.getNetworkSummary(currentEmail));
    }

    @PostMapping(value = "/registrations/{registrationId}/claim-certificate", produces = "application/pdf")
    public ResponseEntity<byte[]> claimCertificate(
            @PathVariable Long registrationId,
            Authentication authentication) {
        String studentEmail = authentication.getName();
        byte[] pdfBytes = eventService.claimCertificatePdf(registrationId, studentEmail);
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"certificate_" + registrationId + ".pdf\"")
                .body(pdfBytes);
    }

    @PostMapping("/request-admin")
    public ResponseEntity<AdminRequestResponse> requestAdminRole(
            @RequestBody AdminRequestPayload payload,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(adminVerificationService.createRequest(user, payload.getCollegeName()));
    }

    @GetMapping("/admin-request-status")
    public ResponseEntity<AdminRequestResponse> getAdminRequestStatus(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        AdminRequestResponse status = adminVerificationService.getMyRequestStatus(user);
        return status != null ? ResponseEntity.ok(status) : ResponseEntity.noContent().build();
    }
}

