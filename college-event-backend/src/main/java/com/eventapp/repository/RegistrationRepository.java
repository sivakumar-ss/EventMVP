package com.eventapp.repository;

import com.eventapp.entity.Registration;
import com.eventapp.entity.Event;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByEvent(Event event);
    List<Registration> findByStudent(User student);
    boolean existsByStudentAndEvent(User student, Event event);
}
