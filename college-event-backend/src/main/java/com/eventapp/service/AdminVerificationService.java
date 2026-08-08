package com.eventapp.service;

import com.eventapp.dto.AdminRequestPayload;
import com.eventapp.dto.AdminRequestResponse;
import com.eventapp.entity.AdminVerificationRequest;
import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.repository.AdminVerificationRequestRepository;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminVerificationService {

    private final AdminVerificationRequestRepository repository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    public AdminRequestResponse createRequest(User user, String collegeName) {
        if (user.getRole() == Role.ROLE_ADMIN) {
            throw new RuntimeException("User is already an admin");
        }

        Optional<AdminVerificationRequest> existingPending = repository.findByUserAndStatus(user, "PENDING");
        if (existingPending.isPresent()) {
            throw new RuntimeException("A verification request is already pending");
        }

        AdminVerificationRequest request = AdminVerificationRequest.builder()
                .user(user)
                .collegeName(collegeName)
                .status("PENDING")
                .build();

        return mapToResponse(repository.save(request));
    }

    public List<AdminRequestResponse> getAllRequests() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AdminRequestResponse getMyRequestStatus(User user) {
        return repository.findTopByUserOrderByCreatedAtDesc(user)
                .map(this::mapToResponse)
                .orElse(null);
    }

    public void approveRequest(Long requestId) {
        AdminVerificationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Request is already processed");
        }

        request.setStatus("APPROVED");
        request.setResolvedAt(LocalDateTime.now());
        repository.save(request);

        User user = request.getUser();
        user.setRole(Role.ROLE_ADMIN);
        user.setCollegeName(request.getCollegeName()); // Ensure the college name is set
        userRepository.save(user);

        notificationService.createNotification(
                user,
                "Your Admin verification request has been APPROVED! Please log out and log back in to access the Admin Dashboard.",
                "SUCCESS"
        );
    }

    public void rejectRequest(Long requestId) {
        AdminVerificationRequest request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Request is already processed");
        }

        request.setStatus("REJECTED");
        request.setResolvedAt(LocalDateTime.now());
        repository.save(request);

        notificationService.createNotification(
                request.getUser(),
                "Your Admin verification request was rejected.",
                "ALERT"
        );
    }

    private AdminRequestResponse mapToResponse(AdminVerificationRequest request) {
        return AdminRequestResponse.builder()
                .id(request.getId())
                .userName(request.getUser().getName())
                .userEmail(request.getUser().getEmail())
                .collegeName(request.getCollegeName())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt() != null ? request.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                .resolvedAt(request.getResolvedAt() != null ? request.getResolvedAt().format(DATE_FORMATTER) : null)
                .build();
    }
}
