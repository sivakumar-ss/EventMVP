package com.eventapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private String studentName;
    private String studentEmail;
    private String createdAt;
}
