package com.mvp.event.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantResponse {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private LocalDateTime registeredAt;
}
