package com.eventapp.controller;

import com.eventapp.entity.PushSubscription;
import com.eventapp.entity.User;
import com.eventapp.repository.PushSubscriptionRepository;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class PushNotificationController {

    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final UserRepository userRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@RequestBody Map<String, Object> subscriptionData, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String endpoint = (String) subscriptionData.get("endpoint");
        
        // Prevent duplicate endpoints
        if (pushSubscriptionRepository.existsByEndpoint(endpoint)) {
            return ResponseEntity.ok().build();
        }

        @SuppressWarnings("unchecked")
        Map<String, String> keys = (Map<String, String>) subscriptionData.get("keys");

        PushSubscription pushSubscription = PushSubscription.builder()
                .user(user)
                .endpoint(endpoint)
                .p256dh(keys.get("p256dh"))
                .auth(keys.get("auth"))
                .build();

        pushSubscriptionRepository.save(pushSubscription);
        return ResponseEntity.ok().build();
    }
}
