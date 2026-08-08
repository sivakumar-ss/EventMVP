package com.eventapp.dto;

import lombok.Data;

@Data
public class SupportTicketRequest {
    private String subject;
    private String description;
}
