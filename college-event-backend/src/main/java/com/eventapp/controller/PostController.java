package com.eventapp.controller;

import com.eventapp.dto.PostDto;
import com.eventapp.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/student/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            Authentication authentication,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {
        String email = authentication.getName();
        return ResponseEntity.ok(postService.createPost(email, content, image));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostDto>> getFeed(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(postService.getFeedForUser(email));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable Long postId,
            Authentication authentication,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {
        String email = authentication.getName();
        return ResponseEntity.ok(postService.updatePost(postId, email, content, image));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostDto> toggleLike(@PathVariable Long postId, Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(postService.toggleLike(postId, email));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostDto> addComment(
            @PathVariable Long postId,
            @RequestBody java.util.Map<String, String> payload,
            Authentication authentication
    ) {
        String email = authentication.getName();
        String content = payload.get("content");
        return ResponseEntity.ok(postService.addComment(postId, email, content));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Authentication authentication) {
        String email = authentication.getName();
        postService.deleteComment(commentId, email);
        return ResponseEntity.ok().build();
    }
}
