package com.eventapp.repository;

import com.eventapp.entity.Event;
import com.eventapp.entity.Feedback;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByEventOrderByCreatedAtDesc(Event event);
    List<Feedback> findByTargetCollegeOrderByCreatedAtDesc(User targetCollege);
    boolean existsByStudentAndEvent(User student, Event event);
    boolean existsByStudentAndTargetCollege(User student, User targetCollege);
}
