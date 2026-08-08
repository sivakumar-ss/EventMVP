package com.mvp.event.repository;

import com.mvp.event.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByStudentId(Long studentId);
    List<Registration> findByEventId(Long eventId);
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.id = :eventId")
    long countByEventId(Long eventId);

    @Query("SELECT COUNT(DISTINCT r.event.id) FROM Registration r WHERE r.student.id = :studentId")
    long countDistinctEventsByStudentId(Long studentId);
}
