package com.eventapp.repository;

import com.eventapp.entity.AdminVerificationRequest;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminVerificationRequestRepository extends JpaRepository<AdminVerificationRequest, Long> {
    List<AdminVerificationRequest> findAllByOrderByCreatedAtDesc();
    Optional<AdminVerificationRequest> findByUserAndStatus(User user, String status);
    Optional<AdminVerificationRequest> findTopByUserOrderByCreatedAtDesc(User user);
    void deleteByUser(User user);
}
