package com.eventapp.service;

import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.entity.Event;
import com.eventapp.repository.EventRepository;
import com.eventapp.repository.RegistrationRepository;
import com.eventapp.repository.UserRepository;
import com.eventapp.repository.NotificationRepository;
import com.eventapp.repository.SupportTicketRepository;
import com.eventapp.repository.AdminVerificationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final AdminVerificationRequestRepository adminVerificationRequestRepository;

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

        // 1. Remove all follow relationships involving this user from the join table
        //    (both entries where they are the follower AND where they are being followed)
        userRepository.deleteFollowingByUserId(id);
        userRepository.deleteFollowersByUserId(id);

        // 2. Delete all event registrations made by this user (as a student)
        registrationRepository.deleteAll(registrationRepository.findByStudent(user));

        // 3. If this user is an admin: delete all events they created
        //    and the registrations for those events first (to avoid FK violations)
        if (user.getRole() == Role.ROLE_ADMIN) {
            for (Event event : eventRepository.findByAdmin(user)) {
                registrationRepository.deleteAll(registrationRepository.findByEvent(event));
            }
            eventRepository.deleteAll(eventRepository.findByAdmin(user));
        }

        // 4. Delete notifications, support tickets, and admin requests
        notificationRepository.deleteByUser(user);
        supportTicketRepository.deleteByAdmin(user);
        adminVerificationRequestRepository.deleteByUser(user);

        // 5. Finally delete the user record itself
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
