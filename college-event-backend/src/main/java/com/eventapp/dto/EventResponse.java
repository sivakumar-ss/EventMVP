package com.eventapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private String date; // Changed from eventDate to date to match frontend
    private String time; // Added time
    private String status;
    private String adminName;
    private String category;
    private String image;
    private int registeredCount; // Changed from participantCount
    private int maxParticipants;
}
