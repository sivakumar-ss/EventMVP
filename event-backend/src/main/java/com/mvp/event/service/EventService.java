package com.mvp.event.service;

import com.mvp.event.dto.request.EventRequest;
import com.mvp.event.dto.response.EventResponse;
import com.mvp.event.entity.Event;
import com.mvp.event.entity.EventStatus;
import com.mvp.event.entity.User;
import com.mvp.event.exception.BadRequestException;
import com.mvp.event.exception.ResourceNotFoundException;
import com.mvp.event.repository.EventRepository;
import com.mvp.event.repository.RegistrationRepository;
import com.mvp.event.repository.UserRepository;
import com.mvp.event.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;

    @Transactional
    public EventResponse createEvent(EventRequest request, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + adminId));

        if (request.getRegistrationDeadline().isAfter(request.getEventDate())) {
            throw new BadRequestException("Registration deadline must be before event date");
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .registrationDeadline(request.getRegistrationDeadline())
                .status(EventStatus.UPCOMING)
                .createdBy(admin)
                .build();

        Event saved = eventRepository.save(event);
        log.info("Admin {} created event: {}", adminId, saved.getTitle());
        return toResponse(saved, null);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        Long currentUserId = getCurrentUserId();
        return eventRepository.findAllByOrderByEventDateAsc()
                .stream()
                .map(e -> toResponse(e, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Long currentUserId = getCurrentUserId();
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
        return toResponse(event, currentUserId);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request, Long adminId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setRegistrationDeadline(request.getRegistrationDeadline());

        return toResponse(eventRepository.save(event), adminId);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
        eventRepository.delete(event);
        log.info("Deleted event id: {}", id);
    }

    @Transactional
    public EventResponse updateEventStatus(Long id, EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + id));
        event.setStatus(status);
        return toResponse(eventRepository.save(event), null);
    }

    /** Auto-close events past their registration deadline every minute */
    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void autoUpdateEventStatus() {
        List<Event> upcoming = eventRepository.findByStatus(EventStatus.UPCOMING);
        LocalDateTime now = LocalDateTime.now();
        upcoming.stream()
                .filter(e -> e.getRegistrationDeadline().isBefore(now))
                .forEach(e -> {
                    e.setStatus(EventStatus.CLOSED);
                    eventRepository.save(e);
                    log.info("Auto-closed event: {} (id={})", e.getTitle(), e.getId());
                });
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    public EventResponse toResponse(Event event, Long currentUserId) {
        boolean registered = currentUserId != null &&
                registrationRepository.existsByStudentIdAndEventId(currentUserId, event.getId());

        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .eventDate(event.getEventDate())
                .registrationDeadline(event.getRegistrationDeadline())
                .status(event.getStatus())
                .createdBy(event.getCreatedBy().getFullName())
                .createdAt(event.getCreatedAt())
                .participantCount(registrationRepository.countByEventId(event.getId()))
                .registeredByCurrentUser(registered)
                .build();
    }

    private Long getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
            return userDetails.getUser().getId();
        }
        return null;
    }
}
