package com.eventapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ParticipantResponse {
    private Long registrationId;
    private String name;
    private String email;
    private String role;
    private String registeredDate;
    private String utrNumber;
    private String paymentScreenshot;
    private String status;
    private boolean certificateGranted;
}
