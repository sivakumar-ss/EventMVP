package com.eventapp.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.ArrayList;

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
    private int likeCount;
    private boolean isLikedByCurrentUser;
    private List<CommentDto> comments = new ArrayList<>();
}
