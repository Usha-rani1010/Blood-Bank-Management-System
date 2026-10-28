package com.usharani.blood_bank_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.usharani.blood_bank_management.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByRole(String role);

    java.util.List<User> findByRole(String role);
}