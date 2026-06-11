package com.eventapp.service;

import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public List<User> getAdminsAndStudents() {
        return userRepository.findByRoleIn(List.of(Role.ROLE_ADMIN, Role.ROLE_STUDENT));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Prevent deleting master admin accounts
        if (user.getRole() == Role.ROLE_MASTER_ADMIN) {
            throw new RuntimeException("Cannot delete a Master Admin account");
        }
        userRepository.deleteById(id);
    }

    public User changeRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Prevent changing master admin role
        if (user.getRole() == Role.ROLE_MASTER_ADMIN) {
            throw new RuntimeException("Cannot modify a Master Admin account");
        }
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public User toggleAdminStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == Role.ROLE_MASTER_ADMIN) {
            throw new RuntimeException("Cannot modify a Master Admin account");
        }
        Role newRole = user.getRole() == Role.ROLE_ADMIN ? Role.ROLE_STUDENT : Role.ROLE_ADMIN;
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public long countByRole(Role role) {
        return userRepository.countByRole(role);
    }
}
