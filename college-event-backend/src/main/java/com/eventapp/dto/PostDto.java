package com.eventapp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PostDto {
    private Long id;
    private Long authorId;
    private String authorName;
    private String authorCollege;
    private String content;
    private String imageUrl;
    private String createdAt;
}
