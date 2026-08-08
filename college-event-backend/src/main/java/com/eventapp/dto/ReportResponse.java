package com.eventapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportResponse {
    private List<MonthlyTrendDTO> monthlyTrends;
    private List<EventParticipationDTO> participationByEvent;
}
