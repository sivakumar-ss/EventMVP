package com.mvp.event.service;

import com.mvp.event.dto.response.ReportResponse;
import com.mvp.event.entity.EventStatus;
import com.mvp.event.entity.Role;
import com.mvp.event.repository.EventRepository;
import com.mvp.event.repository.RegistrationRepository;
import com.mvp.event.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ReportResponse generateReport() {
        long totalEvents = eventRepository.count();
        long totalStudents = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ROLE_STUDENT)
                .count();
        long totalRegistrations = registrationRepository.count();
        long upcomingEvents = eventRepository.findByStatus(EventStatus.UPCOMING).size();
        long closedEvents = eventRepository.findByStatus(EventStatus.CLOSED).size();

        return ReportResponse.builder()
                .totalEvents(totalEvents)
                .totalStudents(totalStudents)
                .totalRegistrations(totalRegistrations)
                .upcomingEvents(upcomingEvents)
                .closedEvents(closedEvents)
                .build();
    }
}
