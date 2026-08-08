package com.mvp.event.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "registrations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "event_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Event event;

    @Column(nullable = false)
    private LocalDateTime registeredAt;

    @PrePersist
    public void prePersist() {
        this.registeredAt = LocalDateTime.now();
    }
}
