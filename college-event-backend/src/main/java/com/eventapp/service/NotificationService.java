package com.eventapp.service;

import com.eventapp.dto.NotificationResponse;
import com.eventapp.entity.Notification;
import com.eventapp.entity.User;
import com.eventapp.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final WebPushService webPushService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    public void createNotification(User user, String message, String type) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        // Mock Email Sending
        System.out.println("=====================================================");
        System.out.println("📧 MOCK EMAIL DISPATCHED via SendGrid/AWS SES");
        System.out.println("To: " + user.getEmail());
        System.out.println("Subject: NexusEvents - " + (type.equals("success") ? "Action Successful" : "Notification"));
        System.out.println("Body: Hello " + user.getName() + ",\n\n" + message);
        System.out.println("=====================================================");
        
        // Send Web Push Notification
        try {
            webPushService.sendPushNotificationToUser(user, "New Notification", message);
        } catch (Exception e) {
            System.err.println("Web Push failed: " + e.getMessage());
        }
    }

    public List<NotificationResponse> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to modify this notification");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt() != null ? notification.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                .build();
    }
}
