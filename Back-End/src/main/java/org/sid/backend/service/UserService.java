package org.sid.backend.service;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.sid.backend.model.Role;
import org.sid.backend.model.User;
import org.sid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.sid.backend.service.KeycloakAdminService;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // Injection du PasswordEncoder
    private static final String KEYCLOAK_URL = "http://localhost:8180/admin/master/console/#/Tunevent/users";
    private static final String REALM = "Tunevent";
    private static final String ADMIN_TOKEN = "YOUR_ADMIN_ACCESS_TOKEN";
    @Autowired
    private KeycloakAdminService keycloakAdminService;

    // Ajouter un utilisateur avec un mot de passe hashé
    public User addUser(User user) {
        // Vérification de l'existence de l'email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }
        // Hachage du mot de passe avant de sauvegarder
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Trouver un utilisateur par ID
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    // Mettre à jour le mot de passe d'un utilisateur
    public void updatePassword(String userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId).orElseThrow(() ->
                new IllegalArgumentException("User not found!"));

        // Vérifier l'ancien mot de passe
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect!");
        }

        // Mettre à jour le mot de passe
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Trouver un utilisateur par email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Supprimer un utilisateur par ID
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found!");
        }
        userRepository.deleteById(id);
    }

    // Trouver les utilisateurs par rôle
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role); // Convert enum to String
    }



    // Authentification de l'utilisateur
    public User authenticate(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            System.out.println("User not found for email: " + email);
            throw new IllegalArgumentException("Invalid credentials");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Invalid password for user: " + email);
            throw new IllegalArgumentException("Invalid credentials");
        }
        System.out.println("User authenticated: " + email);
        return user;
    }



    // Mise à jour de l'utilisateur


    // Créer un utilisateur et le synchroniser avec Keycloak
    public void createUser(String email, String name, String password, String roleString) {
        // Étape 1 : Créer l'utilisateur dans MongoDB
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password)); // Encrypt the password

        try {
            Role role = Role.valueOf(roleString.toUpperCase());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleString);
        }

        // Étape 2 : Synchroniser l'utilisateur avec Keycloak
        try {
            keycloakAdminService.createUserInKeycloak(email, name, password);
            String keycloakId = keycloakAdminService.getKeycloakIdByEmail(email); // Récupérer l'ID Keycloak
            user.setKeycloakId(keycloakId); // Stocker l'ID dans MongoDB
        } catch (Exception e) {
            throw new RuntimeException("Error syncing user with Keycloak: " + e.getMessage());
        }

        userRepository.save(user); // Sauvegarder l'utilisateur avec le Keycloak ID
    }
    public void updateUser(String userId, String name, String password, String roleString) {
        // Validation de l'ID utilisateur
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        // Récupérer l'utilisateur depuis MongoDB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Récupérer le Keycloak ID
        String keycloakId = user.getKeycloakId();
        if (keycloakId == null || keycloakId.isEmpty()) {
            throw new RuntimeException("Keycloak ID is missing for user: " + userId);
        }

        // Mise à jour dans Keycloak
        try {
            keycloakAdminService.updateUserInKeycloak(keycloakId, user.getEmail(), name, password);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update user in Keycloak", e);
        }

        // Mise à jour dans MongoDB
        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        if (roleString != null) {
            try {
                user.setRole(Role.valueOf(roleString.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role: " + roleString, e);
            }
        }

        // Sauvegarder les modifications dans MongoDB
        userRepository.save(user);
    }
    public void updateUserWithPasswordValidation(String userId, String name, String oldPassword, String newPassword, String roleString) {
        try {
            // Step 1: Retrieve User
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found!"));

            // Step 2: Validate Old Password
            if (oldPassword != null && !passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new IllegalArgumentException("Old password is incorrect!");
            }

            // Step 3: Update Fields
            if (name != null && !name.isEmpty()) {
                user.setName(name);
            }
            if (newPassword != null && !newPassword.isEmpty()) {
                user.setPassword(passwordEncoder.encode(newPassword));
            }
            if (roleString != null && !roleString.isEmpty()) {
                try {
                    user.setRole(Role.valueOf(roleString.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Invalid role: " + roleString);
                }
            }

            // Step 4: Update in Keycloak
            String keycloakId = user.getKeycloakId();
            if (keycloakId == null || keycloakId.isEmpty()) {
                throw new RuntimeException("Keycloak ID is missing for user: " + userId);
            }
            keycloakAdminService.updateUserInKeycloak(keycloakId, user.getEmail(), name, newPassword);

            // Step 5: Save in MongoDB
            userRepository.save(user);

        } catch (Exception e) {
            throw new RuntimeException("Error updating user: " + e.getMessage(), e);
        }
    }















}
