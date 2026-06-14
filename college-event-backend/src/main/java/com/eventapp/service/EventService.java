package com.eventapp.service;

import com.eventapp.dto.EventRequest;
import com.eventapp.dto.EventResponse;
import com.eventapp.dto.ParticipantResponse;
import com.eventapp.dto.RegistrationRequest;
import com.eventapp.entity.*;
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
                .description(request.getDescription() != null ? request.getDescription() : "")
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .maxParticipants(request.getMaxParticipants() != null ? request.getMaxParticipants() : 100)
                .status(EventStatus.UPCOMING)
                .admin(admin)
                .image(request.getImage() != null ? request.getImage() : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80")
                .paymentScanner(request.getPaymentScanner() != null ? request.getPaymentScanner() : "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg")
                .build();

        Event savedEvent = eventRepository.save(event);
        return mapToResponse(savedEvent);
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getAdminEvents(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return eventRepository.findByAdmin(admin).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return mapToResponse(event);
    }

    public void registerForEvent(Long eventId, String studentEmail, RegistrationRequest request) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getStatus() == EventStatus.CLOSED) {
            throw new RuntimeException("Event registrations are closed");
        }

        int maxParticipants = event.getMaxParticipants() != null ? event.getMaxParticipants() : 0;
        int currentCount = registrationRepository.findByEvent(event).size();
        if (maxParticipants > 0 && currentCount >= maxParticipants) {
             throw new RuntimeException("Event is already full");
        }

        if (registrationRepository.existsByStudentAndEvent(student, event)) {
            throw new RuntimeException("Already registered for this event");
        }

        Registration registration = Registration.builder()
                .student(student)
                .event(event)
                .utrNumber(request.getUtrNumber())
                .paymentScreenshot(request.getPaymentScreenshot())
                .status(RegistrationStatus.PENDING)
                .build();

        registrationRepository.save(registration);
    }

    public List<EventResponse> getStudentRegistrations(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return registrationRepository.findByStudent(student).stream()
                .map(reg -> {
                    EventResponse response = mapToResponse(reg.getEvent());
                    response.setRegistrationStatus(reg.getStatus() != null ? reg.getStatus().name() : "PENDING");
                    response.setRegistrationId(reg.getId());
                    response.setCertificateClaimed(reg.isCertificateClaimed());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public String claimCertificate(Long registrationId, String studentEmail) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getStudent().getEmail().equals(studentEmail)) {
            throw new RuntimeException("Not authorized to claim this certificate");
        }

        if (registration.getStatus() != RegistrationStatus.VERIFIED) {
            throw new RuntimeException("Certificate only available for verified registrations");
        }

        if (registration.isCertificateClaimed()) {
            return "Certificate already claimed. Points were previously awarded.";
        }

        registration.setCertificateClaimed(true);
        registrationRepository.save(registration);

        String category = registration.getEvent().getCategory();
        int points = "Technical".equalsIgnoreCase(category) ? 10 : 5;
        return "+" + points + " points awarded for claiming your certificate!";
    }
    
    public List<ParticipantResponse> getEventParticipants(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
                
        return registrationRepository.findByEvent(event).stream()
                .map(reg -> ParticipantResponse.builder()
                        .registrationId(reg.getId())
                        .name(reg.getStudent().getName())
                        .email(reg.getStudent().getEmail())
                        .role(reg.getStudent().getRole().name())
                        .registeredDate(reg.getRegisteredAt() != null ? reg.getRegisteredAt().format(DATE_FORMATTER) : "N/A")
                        .utrNumber(reg.getUtrNumber())
                        .paymentScreenshot(reg.getPaymentScreenshot())
                        .status(reg.getStatus() != null ? reg.getStatus().name() : "PENDING")
                        .build())
                .collect(Collectors.toList());
    }

    public void verifyRegistration(Long registrationId, boolean verified, String adminEmail) {
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getEvent().getAdmin().getEmail().equals(adminEmail)) {
            throw new RuntimeException("Not authorized to verify this registration");
        }

        registration.setStatus(verified ? RegistrationStatus.VERIFIED : RegistrationStatus.REJECTED);
        registrationRepository.save(registration);
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
                .collegeName(event.getAdmin().getCollegeName() != null ? event.getAdmin().getCollegeName() : "Unknown College")
                .category(event.getCategory() != null ? event.getCategory() : "General")
                .image(event.getImage())
                .paymentScanner(event.getPaymentScanner())
                .maxParticipants(event.getMaxParticipants())
                .registeredCount(count)
                .build();
    }
}
