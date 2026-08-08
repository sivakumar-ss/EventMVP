package com.eventapp.repository;

import com.eventapp.entity.Role;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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

    @Query("SELECT u FROM User u WHERE u.role = :role AND " +
           "(:search IS NULL OR :search = '' OR LOWER(u.collegeName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<User> searchColleges(@Param("role") Role role, @Param("search") String search);

    /** Remove all rows in user_follows where this user is the follower (they follow others) */
    @Modifying
    @Query(value = "DELETE FROM user_follows WHERE follower_id = :userId", nativeQuery = true)
    void deleteFollowingByUserId(@Param("userId") Long userId);

    /** Remove all rows in user_follows where this user is being followed (others follow them) */
    @Modifying
    @Query(value = "DELETE FROM user_follows WHERE following_id = :userId", nativeQuery = true)
    void deleteFollowersByUserId(@Param("userId") Long userId);
}

