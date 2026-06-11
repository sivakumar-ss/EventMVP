package com.eventapp.controller;

import com.eventapp.dto.EventResponse;
import com.eventapp.dto.StudentNetworkResponse;
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

    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<String> registerForEvent(
            @PathVariable Long eventId, 
            @RequestBody com.eventapp.dto.RegistrationRequest request, 
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
}

