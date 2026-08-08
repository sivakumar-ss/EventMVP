package com.mvp.event.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponse {
    private long totalEvents;
    private long totalStudents;
    private long totalRegistrations;
    private long upcomingEvents;
    private long closedEvents;
}
