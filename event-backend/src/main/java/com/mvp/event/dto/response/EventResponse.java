package com.mvp.event.dto.response;

import com.mvp.event.entity.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime eventDate;
    private LocalDateTime registrationDeadline;
    private EventStatus status;
    private String createdBy;
    private LocalDateTime createdAt;
    private long participantCount;
    private boolean registeredByCurrentUser;
}
