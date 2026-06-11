package com.eventapp.controller;

import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.service.EventService;
import com.eventapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/master-admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MasterAdminController {

    private final UserService userService;
    private final EventService eventService;

    /**
     * Get all admins and students (excludes master admins for safety).
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAdminsAndStudents());
    }

    /**
     * Get only college admins.
     */
    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.ROLE_ADMIN));
    }

    /**
     * Get only students.
     */
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.ROLE_STUDENT));
    }

    /**
     * Delete a user account (admin or student).
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    /**
     * Promote a student to admin or demote an admin to student.
     */
    @PutMapping("/users/{userId}/toggle-role")
    public ResponseEntity<User> toggleRole(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.toggleAdminStatus(userId));
    }

    /**
     * Change user role explicitly.
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<User> changeRole(@PathVariable Long userId, @RequestParam String role) {
        Role newRole;
        if ("ADMIN".equalsIgnoreCase(role) || "ROLE_ADMIN".equalsIgnoreCase(role)) {
            newRole = Role.ROLE_ADMIN;
        } else if ("STUDENT".equalsIgnoreCase(role) || "ROLE_STUDENT".equalsIgnoreCase(role)) {
            newRole = Role.ROLE_STUDENT;
        } else {
            throw new RuntimeException("Invalid role. Must be ADMIN or STUDENT.");
        }
        return ResponseEntity.ok(userService.changeRole(userId, newRole));
    }

    /**
     * Dashboard stats for the master admin.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAdmins", userService.countByRole(Role.ROLE_ADMIN));
        stats.put("totalStudents", userService.countByRole(Role.ROLE_STUDENT));
        stats.put("totalEvents", eventService.getAllEvents().size());
        return ResponseEntity.ok(stats);
    }
}
