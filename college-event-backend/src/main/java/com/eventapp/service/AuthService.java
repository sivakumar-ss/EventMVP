package com.eventapp.service;

import com.eventapp.dto.AuthRequest;
import com.eventapp.dto.AuthResponse;
import com.eventapp.dto.RegisterRequest;
import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import com.eventapp.repository.UserRepository;
import com.eventapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        Role role = Role.ROLE_STUDENT;
        if ("ADMIN".equalsIgnoreCase(request.getRole()) || "ROLE_ADMIN".equalsIgnoreCase(request.getRole())) {
            role = Role.ROLE_ADMIN;
        }
        // MASTER_ADMIN cannot be self-registered — only seeded via database

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .collegeName(request.getCollegeName())
                .role(role)
                .build();

        userRepository.save(user);

        String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(jwtToken, user.getRole().name(), user.getId());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(jwtToken, user.getRole().name(), user.getId());
    }
}
