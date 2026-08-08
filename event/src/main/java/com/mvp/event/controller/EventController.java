package com.mvp.event.controller;

import com.mvp.event.dto.request.EventRequest;
import com.mvp.event.dto.response.EventResponse;
import com.mvp.event.dto.response.MessageResponse;
import com.mvp.event.entity.EventStatus;
import com.mvp.event.security.UserDetailsImpl;
import com.mvp.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /** Public – list all events */
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    /** Public – get single event */
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    /** Admin – create event */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(eventService.createEvent(request, userDetails.getUser().getId()));
    }

    /** Admin – update event */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, userDetails.getUser().getId()));
    }

    /** Admin – delete event */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(new MessageResponse("Event deleted successfully"));
    }

    /** Admin – change event status */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam EventStatus status) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, status));
    }
}
