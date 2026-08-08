package com.mvp.event.repository;

import com.mvp.event.entity.Event;
import com.mvp.event.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(EventStatus status);
    List<Event> findByCreatedById(Long adminId);
    List<Event> findAllByOrderByEventDateAsc();
}
