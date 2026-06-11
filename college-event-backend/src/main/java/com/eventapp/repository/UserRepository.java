package com.eventapp.repository;

import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleIn(List<Role> roles);
    long countByRole(Role role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.id <> :userId AND " +
           "(:search IS NULL OR :search = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.collegeName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<User> searchOtherStudents(@Param("role") Role role, @Param("userId") Long userId, @Param("search") String search);
}

