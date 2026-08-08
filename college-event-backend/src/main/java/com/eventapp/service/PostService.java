package com.eventapp.service;

import com.eventapp.dto.PostDto;
import com.eventapp.entity.Post;
import com.eventapp.entity.User;
import com.eventapp.repository.PostRepository;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public PostDto createPost(String email, String content, MultipartFile image) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            imageUrl = "data:" + image.getContentType() + ";base64," + base64Image;
        }

        Post post = Post.builder()
                .author(user)
                .content(content)
                .imageUrl(imageUrl)
                .build();

        Post savedPost = postRepository.save(post);
        return mapToDto(savedPost);
    }

    @Transactional(readOnly = true)
    public List<PostDto> getFeedForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<User> authors = new HashSet<>(user.getFollowing());
        authors.add(user); // Include own posts

        List<Post> posts = postRepository.findByAuthorInOrderByCreatedAtDesc(authors);
        return posts.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public PostDto updatePost(Long postId, String email, String content, MultipartFile image) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        if (!post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("You can only edit your own posts");
        }

        if (content != null) {
            post.setContent(content);
        }

        if (image != null && !image.isEmpty()) {
            String base64Image = Base64.getEncoder().encodeToString(image.getBytes());
            String imageUrl = "data:" + image.getContentType() + ";base64," + base64Image;
            post.setImageUrl(imageUrl);
        }

        Post savedPost = postRepository.save(post);
        return mapToDto(savedPost);
    }

    private PostDto mapToDto(Post post) {
        return PostDto.builder()
                .id(post.getId())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getName())
                .authorCollege(post.getAuthor().getCollegeName())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .createdAt(post.getCreatedAt() != null ? post.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")) : "")
                .build();
    }
}
