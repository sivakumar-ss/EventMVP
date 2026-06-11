package com.eventapp.repository;

import com.eventapp.entity.Event;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByAdmin(User admin);
    boolean existsByTitle(String title);
}
