package com.mvp.event.service;

import com.mvp.event.dto.request.LoginRequest;
import com.mvp.event.dto.request.RegisterRequest;
import com.mvp.event.dto.response.JwtResponse;
import com.mvp.event.dto.response.MessageResponse;
import com.mvp.event.entity.Role;
import com.mvp.event.entity.User;
import com.mvp.event.exception.BadRequestException;
import com.mvp.event.repository.UserRepository;
import com.mvp.event.security.JwtUtils;
import com.mvp.event.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        Role role = Role.ROLE_STUDENT;
        if ("ROLE_ADMIN".equalsIgnoreCase(request.getRole())) {
            role = Role.ROLE_ADMIN;
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(role)
                .build();

        userRepository.save(user);
        log.info("Registered new user: {} with role: {}", user.getUsername(), role);
        return new MessageResponse("User registered successfully!");
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);

        return new JwtResponse(
                jwt,
                userDetails.getUser().getId(),
                userDetails.getUsername(),
                userDetails.getUser().getEmail(),
                userDetails.getUser().getFullName(),
                userDetails.getUser().getRole().name()
        );
    }
}
