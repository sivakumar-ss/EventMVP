package com.eventapp.service;

import com.eventapp.dto.StudentNetworkResponse;
import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentNetworkService {

    private final UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    private StudentNetworkResponse toResponse(User targetUser, User currentUser) {
        return StudentNetworkResponse.builder()
                .id(targetUser.getId())
                .name(targetUser.getName())
                .email(targetUser.getEmail())
                .collegeName(targetUser.getCollegeName())
                .followersCount(targetUser.getFollowers().size())
                .followingCount(targetUser.getFollowing().size())
                .isFollowing(currentUser.getFollowing().contains(targetUser))
                .build();
    }

    public List<StudentNetworkResponse> searchStudents(String currentEmail, String search) {
        User currentUser = getUserByEmail(currentEmail);
        List<User> users = userRepository.searchOtherStudents(Role.ROLE_STUDENT, currentUser.getId(), search);
        return users.stream()
                .map(u -> toResponse(u, currentUser))
                .collect(Collectors.toList());
    }

    public void follow(String currentEmail, Long targetId) {
        User currentUser = getUserByEmail(currentEmail);
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (currentUser.getId().equals(targetId)) {
            throw new RuntimeException("You cannot follow yourself");
        }

        currentUser.getFollowing().add(targetUser);
        userRepository.save(currentUser);
    }

    public void unfollow(String currentEmail, Long targetId) {
        User currentUser = getUserByEmail(currentEmail);
        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        currentUser.getFollowing().remove(targetUser);
        userRepository.save(currentUser);
    }

    public List<StudentNetworkResponse> getFollowers(String currentEmail) {
        User currentUser = getUserByEmail(currentEmail);
        return currentUser.getFollowers().stream()
                .map(u -> toResponse(u, currentUser))
                .collect(Collectors.toList());
    }

    public List<StudentNetworkResponse> getFollowing(String currentEmail) {
        User currentUser = getUserByEmail(currentEmail);
        return currentUser.getFollowing().stream()
                .map(u -> toResponse(u, currentUser))
                .collect(Collectors.toList());
    }

    public StudentNetworkResponse getNetworkSummary(String currentEmail) {
        User currentUser = getUserByEmail(currentEmail);
        return StudentNetworkResponse.builder()
                .id(currentUser.getId())
                .name(currentUser.getName())
                .email(currentUser.getEmail())
                .collegeName(currentUser.getCollegeName())
                .followersCount(currentUser.getFollowers().size())
                .followingCount(currentUser.getFollowing().size())
                .isFollowing(false)
                .build();
    }
}
