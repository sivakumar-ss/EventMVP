package com.eventapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventRequest {
    private String title;
    private String description;
    private String venue;
    private LocalDateTime eventDate;
    private String category;
    private Integer maxParticipants;
    private String image;
    private String paymentScanner;
    private Double fee;
}
