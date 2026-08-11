package com.eventapp.service;

import com.eventapp.dto.StudentNetworkResponse;
import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.entity.Registration;
import com.eventapp.entity.RegistrationStatus;
import com.eventapp.repository.UserRepository;
import com.eventapp.repository.RegistrationRepository;
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
    private final RegistrationRepository registrationRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    private int calculateScore(User student) {
        List<Registration> regs = registrationRepository.findByStudent(student);
        int score = 0;
        for (Registration reg : regs) {
            if (reg.getStatus() == RegistrationStatus.VERIFIED && reg.isCertificateGranted()) {
                if (reg.getEvent() != null && "Technical".equalsIgnoreCase(reg.getEvent().getCategory())) {
                    score += 10;
                } else {
                    score += 5;
                }
            }
        }
        return score;
    }

    private StudentNetworkResponse toResponse(User targetUser, User currentUser) {
        boolean isFollowing = currentUser.getFollowing().stream()
                .anyMatch(u -> u.getId().equals(targetUser.getId()));
        return StudentNetworkResponse.builder()
                .id(targetUser.getId())
                .name(targetUser.getName())
                .email(targetUser.getEmail())
                .collegeName(targetUser.getCollegeName())
                .followersCount(targetUser.getFollowers().size())
                .followingCount(targetUser.getFollowing().size())
                .isFollowing(isFollowing)
                .score(calculateScore(targetUser))
                .build();
    }

    public List<StudentNetworkResponse> searchStudents(String currentEmail, String search) {
        User currentUser = getUserByEmail(currentEmail);
        List<User> users = userRepository.searchOtherStudents(Role.ROLE_STUDENT, currentUser.getId(), search);
        return users.stream()
                .map(u -> toResponse(u, currentUser))
                .collect(Collectors.toList());
    }

    public List<StudentNetworkResponse> searchColleges(String currentEmail, String search) {
        User currentUser = getUserByEmail(currentEmail);
        List<User> colleges = userRepository.searchColleges(Role.ROLE_ADMIN, search);
        return colleges.stream()
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

        boolean alreadyFollowing = currentUser.getFollowing().stream()
                .anyMatch(u -> u.getId().equals(targetId));
        if (!alreadyFollowing) {
            currentUser.getFollowing().add(targetUser);
            userRepository.save(currentUser);
        }
    }

    public void unfollow(String currentEmail, Long targetId) {
        User currentUser = getUserByEmail(currentEmail);
        currentUser.getFollowing().removeIf(u -> u.getId().equals(targetId));
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
                .filter(u -> u.getRole() == Role.ROLE_STUDENT)
                .map(u -> toResponse(u, currentUser))
                .collect(Collectors.toList());
    }

    public List<StudentNetworkResponse> getFollowingColleges(String currentEmail) {
        User currentUser = getUserByEmail(currentEmail);
        return currentUser.getFollowing().stream()
                .filter(u -> u.getRole() == Role.ROLE_ADMIN)
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
                .score(calculateScore(currentUser))
                .build();
    }
}
