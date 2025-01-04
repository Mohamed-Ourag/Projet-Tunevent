package org.sid.backend.DTO;


import lombok.Data;

@Data
public class SignupRequest {
    public String name;
    private String email;
    private String password;
    private String role;

    // Getters and setters
}

