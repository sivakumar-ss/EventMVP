package com.eventapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportTicketResponse {
    private Long id;
    private String adminName;
    private String adminEmail;
    private String subject;
    private String description;
    private String status;
    private String createdAt;
    private String resolvedAt;
}
