package com.mvp.event.service;

import com.mvp.event.dto.response.EventResponse;
import com.mvp.event.dto.response.MessageResponse;
import com.mvp.event.dto.response.ParticipantResponse;
import com.mvp.event.entity.Event;
import com.mvp.event.entity.EventStatus;
import com.mvp.event.entity.Registration;
import com.mvp.event.entity.User;
import com.mvp.event.exception.BadRequestException;
import com.mvp.event.exception.ResourceNotFoundException;
import com.mvp.event.repository.EventRepository;
import com.mvp.event.repository.RegistrationRepository;
import com.mvp.event.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventService eventService;
    private final ReminderService reminderService;

    @Transactional
    public MessageResponse register(Long studentId, Long eventId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));

        if (event.getStatus() == EventStatus.CLOSED) {
            throw new BadRequestException("Registration for this event is closed");
        }
        if (registrationRepository.existsByStudentIdAndEventId(studentId, eventId)) {
            throw new BadRequestException("You are already registered for this event");
        }

        Registration reg = Registration.builder()
                .student(student)
                .event(event)
                .build();
        registrationRepository.save(reg);

        // Console-based reminder simulation
        reminderService.sendRegistrationConfirmation(student, event);
        log.info("Student {} registered for event {}", studentId, eventId);

        return new MessageResponse("Successfully registered for event: " + event.getTitle());
    }

    @Transactional
    public MessageResponse cancelRegistration(Long studentId, Long eventId) {
        Registration reg = registrationRepository.findByStudentIdAndEventId(studentId, eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));
        registrationRepository.delete(reg);
        log.info("Student {} cancelled registration for event {}", studentId, eventId);
        return new MessageResponse("Registration cancelled successfully");
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getRegisteredEvents(Long studentId) {
        return registrationRepository.findByStudentId(studentId)
                .stream()
                .map(reg -> eventService.toResponse(reg.getEvent(), studentId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ParticipantResponse> getParticipants(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found: " + eventId);
        }
        return registrationRepository.findByEventId(eventId)
                .stream()
                .map(reg -> ParticipantResponse.builder()
                        .userId(reg.getStudent().getId())
                        .username(reg.getStudent().getUsername())
                        .fullName(reg.getStudent().getFullName())
                        .email(reg.getStudent().getEmail())
                        .registeredAt(reg.getRegisteredAt())
                        .build())
                .collect(Collectors.toList());
    }
}
