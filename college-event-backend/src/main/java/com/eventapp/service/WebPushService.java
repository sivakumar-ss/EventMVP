package com.eventapp.service;

import com.eventapp.entity.PushSubscription;
import com.eventapp.entity.User;
import com.eventapp.repository.PushSubscriptionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebPushService {

    @Value("${vapid.public.key}")
    private String publicKey;

    @Value("${vapid.private.key}")
    private String privateKey;

    @Value("${vapid.subject}")
    private String subject;

    private PushService pushService;
    private final PushSubscriptionRepository subscriptionRepository;

    @PostConstruct
    private void init() {
        try {
            Security.addProvider(new BouncyCastleProvider());
            pushService = new PushService(publicKey, privateKey, subject);
        } catch (GeneralSecurityException e) {
            log.error("Failed to initialize WebPushService", e);
        }
    }

    public void sendPushNotificationToUser(User user, String title, String message) {
        List<PushSubscription> subs = subscriptionRepository.findByUser(user);
        
        String payload = String.format("{\"title\":\"%s\", \"message\":\"%s\"}", title, message);

        for (PushSubscription sub : subs) {
            try {
                Subscription.Keys keys = new Subscription.Keys(sub.getP256dh(), sub.getAuth());
                Subscription subscription = new Subscription(sub.getEndpoint(), keys);
                Notification notification = new Notification(subscription, payload);
                
                pushService.send(notification);
            } catch (Exception e) {
                log.error("Failed to send push notification to endpoint {}: {}", sub.getEndpoint(), e.getMessage());
                if (e.getMessage().contains("410 Gone") || e.getMessage().contains("404 Not Found")) {
                    subscriptionRepository.deleteByEndpoint(sub.getEndpoint());
                }
            }
        }
    }
}
