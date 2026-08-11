package com.eventapp.controller;

import com.eventapp.dto.FeedbackRequest;
import com.eventapp.dto.FeedbackResponse;
import com.eventapp.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/student/feedback/event/{eventId}")
    public ResponseEntity<?> addEventFeedback(
            @PathVariable Long eventId,
            @RequestBody FeedbackRequest request,
            Authentication authentication) {
        feedbackService.addEventFeedback(authentication.getName(), eventId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/student/feedback/college/{collegeId}")
    public ResponseEntity<?> addCollegeFeedback(
            @PathVariable Long collegeId,
            @RequestBody FeedbackRequest request,
            Authentication authentication) {
        feedbackService.addCollegeFeedback(authentication.getName(), collegeId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/public/feedback/event/{eventId}")
    public ResponseEntity<List<FeedbackResponse>> getEventFeedback(@PathVariable Long eventId) {
        return ResponseEntity.ok(feedbackService.getEventFeedback(eventId));
    }

    @GetMapping("/public/feedback/college/{collegeId}")
    public ResponseEntity<List<FeedbackResponse>> getCollegeFeedback(@PathVariable Long collegeId) {
        return ResponseEntity.ok(feedbackService.getCollegeFeedback(collegeId));
    }
}
