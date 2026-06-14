package com.eventapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentNetworkResponse {
    private Long id;
    private String name;
    private String email;
    private String collegeName;
    private int followersCount;
    private int followingCount;
    @JsonProperty("isFollowing")
    private boolean isFollowing;
    private int score;
}
