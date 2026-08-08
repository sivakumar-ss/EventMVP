package com.eventapp.repository;

import com.eventapp.entity.PushSubscription;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    List<PushSubscription> findByUser(User user);
    void deleteByEndpoint(String endpoint);
    boolean existsByEndpoint(String endpoint);
}
