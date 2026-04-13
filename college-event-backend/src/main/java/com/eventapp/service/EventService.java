package com.eventapp.service;

import com.eventapp.dto.EventRequest;
import com.eventapp.dto.EventResponse;
import com.eventapp.dto.ParticipantResponse;
import com.eventapp.entity.Event;
import com.eventapp.entity.EventStatus;
import com.eventapp.entity.Registration;
import com.eventapp.entity.User;
import com.eventapp.repository.EventRepository;
import com.eventapp.repository.RegistrationRepository;
import com.eventapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public EventResponse createEvent(EventRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .category(request.getCategory())
                .maxParticipants(request.getMaxParticipants())
                .image(request.getImage())
                .admin(admin)
                .status(EventStatus.UPCOMING)
                .build();

        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToResponse(event);
    }

    public void registerForEvent(Long eventId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getStatus() == EventStatus.CLOSED) {
            throw new RuntimeException("Event registrations are closed");
        }

        int currentCount = registrationRepository.findByEvent(event).size();
        if (event.getMaxParticipants() > 0 && currentCount >= event.getMaxParticipants()) {
             throw new RuntimeException("Event is already full");
        }

        if (registrationRepository.existsByStudentAndEvent(student, event)) {
            throw new RuntimeException("Already registered for this event");
        }

        Registration registration = Registration.builder()
                .student(student)
                .event(event)
                .build();

        registrationRepository.save(registration);
    }

    public List<EventResponse> getStudentRegistrations(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return registrationRepository.findByStudent(student).stream()
                .map(reg -> mapToResponse(reg.getEvent()))
                .collect(Collectors.toList());
    }
    
    public List<ParticipantResponse> getEventParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
                
        return registrationRepository.findByEvent(event).stream()
                .map(reg -> ParticipantResponse.builder()
                        .name(reg.getStudent().getName())
                        .email(reg.getStudent().getEmail())
                        .role(reg.getStudent().getRole().name())
                        .registeredDate(reg.getRegisteredAt().format(DATE_FORMATTER))
                        .build())
                .collect(Collectors.toList());
    }
    
    public EventResponse closeEvent(Long eventId, String adminEmail) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
                
        if (!event.getAdmin().getEmail().equals(adminEmail)) {
            throw new RuntimeException("Not authorized to close this event");
        }
        
        event.setStatus(EventStatus.CLOSED);
        eventRepository.save(event);
        return mapToResponse(event);
    }

    private EventResponse mapToResponse(Event event) {
        int count = registrationRepository.findByEvent(event).size();
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .date(event.getEventDate().format(DATE_FORMATTER))
                .time(event.getEventDate().format(TIME_FORMATTER))
                .status(event.getStatus().name())
                .adminName(event.getAdmin().getName())
                .category(event.getCategory() != null ? event.getCategory() : "General")
                .image(event.getImage())
                .registeredCount(count)
                .maxParticipants(event.getMaxParticipants())
                .build();
    }
}
