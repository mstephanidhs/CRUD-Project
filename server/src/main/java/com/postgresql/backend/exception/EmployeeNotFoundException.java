package com.postgresql.backend.exception;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException(Long id) {
        super("Could not found the employee with id " + id);
    }

    public EmployeeNotFoundException(String email) {
        super("Could not found the employee with email " + email);
    }
}
