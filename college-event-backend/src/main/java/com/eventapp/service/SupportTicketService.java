package com.eventapp.service;

import com.eventapp.dto.SupportTicketRequest;
import com.eventapp.dto.SupportTicketResponse;
import com.eventapp.entity.SupportTicket;
import com.eventapp.entity.User;
import com.eventapp.repository.SupportTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportTicketService {
    private final SupportTicketRepository supportTicketRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");

    public void createTicket(User admin, SupportTicketRequest request) {
        SupportTicket ticket = SupportTicket.builder()
                .admin(admin)
                .subject(request.getSubject())
                .description(request.getDescription())
                .build();
        supportTicketRepository.save(ticket);
    }

    public List<SupportTicketResponse> getAdminTickets(User admin) {
        return supportTicketRepository.findByAdminOrderByCreatedAtDesc(admin).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<SupportTicketResponse> getAllTickets() {
        return supportTicketRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void resolveTicket(Long ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        ticket.setStatus("RESOLVED");
        ticket.setResolvedAt(LocalDateTime.now());
        supportTicketRepository.save(ticket);
    }

    private SupportTicketResponse mapToResponse(SupportTicket ticket) {
        return SupportTicketResponse.builder()
                .id(ticket.getId())
                .adminName(ticket.getAdmin().getName())
                .adminEmail(ticket.getAdmin().getEmail())
                .subject(ticket.getSubject())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .createdAt(ticket.getCreatedAt() != null ? ticket.getCreatedAt().format(DATE_FORMATTER) : "N/A")
                .resolvedAt(ticket.getResolvedAt() != null ? ticket.getResolvedAt().format(DATE_FORMATTER) : null)
                .build();
    }
}
