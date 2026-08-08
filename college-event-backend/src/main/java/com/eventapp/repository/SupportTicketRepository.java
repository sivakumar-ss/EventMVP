package com.eventapp.repository;

import com.eventapp.entity.SupportTicket;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findByAdminOrderByCreatedAtDesc(User admin);
    List<SupportTicket> findAllByOrderByCreatedAtDesc();
    void deleteByAdmin(User admin);
}
