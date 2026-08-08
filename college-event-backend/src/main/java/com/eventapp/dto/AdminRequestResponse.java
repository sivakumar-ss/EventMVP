package com.eventapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRequestResponse {
    private Long id;
    private String userName;
    private String userEmail;
    private String collegeName;
    private String status;
    private String createdAt;
    private String resolvedAt;
}
