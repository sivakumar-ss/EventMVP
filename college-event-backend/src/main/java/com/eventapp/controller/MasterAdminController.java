package com.eventapp.controller;

import com.eventapp.dto.AdminRequestResponse;
import com.eventapp.dto.SupportTicketResponse;
import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.repository.UserRepository;
import com.eventapp.service.AdminVerificationService;
import com.eventapp.service.EventService;
import com.eventapp.service.SupportTicketService;
import com.eventapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/master-admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MasterAdminController {

    private final UserService userService;
    private final EventService eventService;
    private final UserRepository userRepository;
    private final SupportTicketService supportTicketService;
    private final AdminVerificationService adminVerificationService;
    private final com.eventapp.repository.RegistrationRepository registrationRepository;
    private final com.eventapp.repository.SupportTicketRepository supportTicketRepository;
    private final com.eventapp.repository.AdminVerificationRequestRepository adminVerificationRequestRepository;

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
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalAdmins = userRepository.countByRole(Role.ROLE_ADMIN);
        long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);
        long totalEvents = eventService.getAllEvents().size();
        
        long pendingAdminRequests = adminVerificationRequestRepository.findAll().stream()
                .filter(r -> "PENDING".equals(r.getStatus())).count();
                
        long openSupportTickets = supportTicketRepository.findAll().stream()
                .filter(t -> "OPEN".equals(t.getStatus())).count();
                
        long totalRegistrations = registrationRepository.count();
        
        return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalAdmins", totalAdmins,
                "totalStudents", totalStudents,
                "totalEvents", totalEvents,
                "pendingAdminRequests", pendingAdminRequests,
                "openSupportTickets", openSupportTickets,
                "totalRegistrations", totalRegistrations
        ));
    }

    @GetMapping("/support-tickets")
    public ResponseEntity<List<SupportTicketResponse>> getAllSupportTickets() {
        return ResponseEntity.ok(supportTicketService.getAllTickets());
    }

    @PutMapping("/support-tickets/{ticketId}/resolve")
    public ResponseEntity<String> resolveSupportTicket(@PathVariable Long ticketId) {
        supportTicketService.resolveTicket(ticketId);
        return ResponseEntity.ok("Ticket marked as resolved");
    }

    @GetMapping("/admin-requests")
    public ResponseEntity<List<AdminRequestResponse>> getAllAdminRequests() {
        return ResponseEntity.ok(adminVerificationService.getAllRequests());
    }

    @PutMapping("/admin-requests/{id}/approve")
    public ResponseEntity<String> approveAdminRequest(@PathVariable Long id) {
        adminVerificationService.approveRequest(id);
        return ResponseEntity.ok("Admin request approved");
    }

    @PutMapping("/admin-requests/{id}/reject")
    public ResponseEntity<String> rejectAdminRequest(@PathVariable Long id) {
        adminVerificationService.rejectRequest(id);
        return ResponseEntity.ok("Admin request rejected");
    }
}
