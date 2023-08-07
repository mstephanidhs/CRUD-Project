package com.postgresql.backend.repository;

import com.postgresql.backend.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    // helper functions (queries)
    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmailAndPassword(String email, String password);
}
