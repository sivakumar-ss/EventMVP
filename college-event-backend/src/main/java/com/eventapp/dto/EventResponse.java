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
    private String collegeName;
    private String category;
    private String image;
    private String paymentScanner;
    private Double fee;
    private Integer registeredCount; // Changed from participantCount
    private Integer maxParticipants;
    private String registrationStatus;
    private Long registrationId;
    private boolean certificateClaimed;
    private boolean certificateGranted;
}
