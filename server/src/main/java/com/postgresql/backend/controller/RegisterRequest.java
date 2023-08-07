package com.postgresql.backend.controller;

import com.postgresql.backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String fullName;

    private String email;

    private String jobTitle;

    private String afm;

    private float salary;

    private String password;

    private Role role;
}
