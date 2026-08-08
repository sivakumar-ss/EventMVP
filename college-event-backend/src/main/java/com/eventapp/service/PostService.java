package com.eventapp.service;

import com.eventapp.dto.PostDto;
import com.eventapp.entity.Post;
import com.eventapp.entity.User;
import com.eventapp.repository.PostRepository;
import com.eventapp.repository.UserRepository;
import com.eventapp.entity.Comment;
import com.eventapp.dto.CommentDto;
import com.eventapp.repository.CommentRepository;
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
    private final CommentRepository commentRepository;

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
        return mapToDto(savedPost, user);
    }

    @Transactional(readOnly = true)
    public List<PostDto> getFeedForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<User> authors = new HashSet<>(user.getFollowing());
        authors.add(user); // Include own posts

        List<Post> posts = postRepository.findByAuthorInOrderByCreatedAtDesc(authors);
        return posts.stream().map(post -> mapToDto(post, user)).collect(Collectors.toList());
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
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(savedPost, user);
    }

    @Transactional
    public PostDto toggleLike(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (post.getLikedBy().contains(user)) {
            post.getLikedBy().remove(user);
        } else {
            post.getLikedBy().add(user);
        }

        Post savedPost = postRepository.save(post);
        return mapToDto(savedPost, user);
    }

    @Transactional
    public PostDto addComment(Long postId, String email, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .post(post)
                .author(user)
                .content(content)
                .build();
        commentRepository.save(comment);

        // Re-fetch or manually add to post.comments so mapToDto picks it up.
        // Spring Data JPA saves the comment, but the post object in memory won't have it unless we add it.
        post.getComments().add(comment);
        
        return mapToDto(post, user);
    }

    @Transactional
    public void deleteComment(Long commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete your own comments");
        }
        commentRepository.delete(comment);
    }

    private PostDto mapToDto(Post post, User currentUser) {
        List<CommentDto> commentDtos = post.getComments().stream()
                .map(c -> CommentDto.builder()
                        .id(c.getId())
                        .authorId(c.getAuthor().getId())
                        .authorName(c.getAuthor().getName())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, HH:mm")) : "")
                        .build())
                .collect(Collectors.toList());

        return PostDto.builder()
                .id(post.getId())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getName())
                .authorCollege(post.getAuthor().getCollegeName())
                .content(post.getContent())
                .imageUrl(post.getImageUrl())
                .createdAt(post.getCreatedAt() != null ? post.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm")) : "")
                .likeCount(post.getLikedBy().size())
                .isLikedByCurrentUser(post.getLikedBy().contains(currentUser))
                .comments(commentDtos)
                .build();
    }
}
