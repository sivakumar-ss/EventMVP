package com.eventapp.repository;

import com.eventapp.entity.Post;
import com.eventapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorInOrderByCreatedAtDesc(Set<User> authors);
}
