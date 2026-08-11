package com.eventapp.service;

import com.eventapp.dto.FeedbackRequest;
import com.eventapp.dto.FeedbackResponse;
import com.eventapp.entity.Event;
import com.eventapp.entity.Feedback;
import com.eventapp.entity.User;
import com.eventapp.entity.Role;
import com.eventapp.repository.EventRepository;
import com.eventapp.repository.FeedbackRepository;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private FeedbackResponse mapToResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .studentName(feedback.getStudent().getName())
                .studentEmail(feedback.getStudent().getEmail())
                .createdAt(feedback.getCreatedAt() != null ? feedback.getCreatedAt().format(FORMATTER) : "")
                .build();
    }

    public void addEventFeedback(String currentEmail, Long eventId, FeedbackRequest request) {
        User student = getUserByEmail(currentEmail);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (feedbackRepository.existsByStudentAndEvent(student, event)) {
            throw new RuntimeException("You have already submitted feedback for this event.");
        }

        Feedback feedback = Feedback.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .student(student)
                .event(event)
                .build();

        feedbackRepository.save(feedback);
    }

    public void addCollegeFeedback(String currentEmail, Long collegeId, FeedbackRequest request) {
        User student = getUserByEmail(currentEmail);
        User college = userRepository.findById(collegeId)
                .orElseThrow(() -> new RuntimeException("College not found"));
        
        if (college.getRole() != Role.ROLE_ADMIN && college.getRole() != Role.ROLE_MASTER_ADMIN) {
            throw new RuntimeException("Target user is not a college admin");
        }

        if (feedbackRepository.existsByStudentAndTargetCollege(student, college)) {
            throw new RuntimeException("You have already submitted feedback for this college.");
        }

        Feedback feedback = Feedback.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .student(student)
                .targetCollege(college)
                .build();

        feedbackRepository.save(feedback);
    }

    public List<FeedbackResponse> getEventFeedback(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return feedbackRepository.findByEventOrderByCreatedAtDesc(event).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FeedbackResponse> getCollegeFeedback(Long collegeId) {
        User college = userRepository.findById(collegeId)
                .orElseThrow(() -> new RuntimeException("College not found"));
        return feedbackRepository.findByTargetCollegeOrderByCreatedAtDesc(college).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
}
