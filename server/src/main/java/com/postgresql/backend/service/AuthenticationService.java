package com.postgresql.backend.service;

import com.postgresql.backend.controller.AuthenticationRequest;
import com.postgresql.backend.controller.AuthenticationResponse;
import com.postgresql.backend.controller.RegisterRequest;
import com.postgresql.backend.model.Employee;
import com.postgresql.backend.model.Role;
import com.postgresql.backend.repository.EmployeeRepo;
import lombok.RequiredArgsConstructor;
import org.hibernate.query.hql.spi.SemanticPathPart;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final EmployeeRepo employeeRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        Optional<Employee> existingEmployee = employeeRepo.findByEmail(request.getEmail());

        if (existingEmployee.isPresent()) {
            return AuthenticationResponse.builder().build();
        }


        // create the new employee
        var employee = Employee.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .jobTitle(request.getJobTitle())
                .afm(request.getAfm())
                .salary(request.getSalary())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        // save it
        employeeRepo.save(employee);
        // generate the JWT Token
        var jwtToken = jwtService.generateToken(employee);
        // return token
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        // allow us to authenticate the user based on its email and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        // if I get to this point, means that the user has been authenticated
        var employee = employeeRepo.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken = jwtService.generateToken(employee);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

}
