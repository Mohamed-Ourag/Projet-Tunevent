package org.sid.backend.controller;


import org.sid.backend.DTO.LoginRequest;
import org.sid.backend.DTO.SignupRequest;
import org.sid.backend.model.Role;
import org.sid.backend.model.User;
import org.sid.backend.service.KeycloakAdminService;
import org.sid.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired

    private  UserService userService;
    @Autowired
    private KeycloakAdminService keycloakAdminService;

    /**
     * Récupérer tous les utilisateurs.
     *
     * @return Liste des utilisateurs.
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Ajouter un nouvel utilisateur.
     *
     * @param user Détails de l'utilisateur.
     * @return Utilisateur ajouté.
     */
    @PostMapping
    public ResponseEntity<Object> createUser(@RequestBody User user) {
        try {
            User newUser = userService.addUser(user);
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists!");
        }
    }

    /**
     * Récupérer un utilisateur par ID.
     *
     * @param id Identifiant de l'utilisateur.
     * @return Utilisateur trouvé ou message d'erreur.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.<ResponseEntity<Object>>map(u -> ResponseEntity.ok(u))
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("User not found!"));
    }




    /**
     * Mettre à jour un utilisateur existant.
     *
     * @return Utilisateur mis à jour.
     */
    @PutMapping("/{userId}")
    public ResponseEntity<Object> updateUser(
            @PathVariable String userId,
            @RequestBody Map<String, String> payload) {
        try {
            // Extraire les données du payload
            String name = payload.get("name");
            String oldPassword = payload.get("oldPassword");
            String newPassword = payload.get("newPassword");
            String roleString = payload.get("roleString");

            // Ajout de journaux pour débogage
            System.out.println("Request payload: " + payload);
            System.out.println("User ID: " + userId);
            System.out.println("Old Password: " + oldPassword);
            System.out.println("New Password: " + newPassword);
            System.out.println("Role: " + roleString);

            // Appeler le service pour effectuer la mise à jour
            userService.updateUserWithPasswordValidation(userId, name, oldPassword, newPassword, roleString);

            return ResponseEntity.ok("User updated successfully!");
        } catch (IllegalArgumentException e) {
            System.err.println("Validation error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }







    /**
     * Mettre à jour le mot de passe d'un utilisateur.
     *
     * @param id          Identifiant de l'utilisateur.
     * @param oldPassword Ancien mot de passe.
     * @param newPassword Nouveau mot de passe.
     * @return Message de confirmation.
     */
    @PutMapping("/updatePassword")
    public ResponseEntity<Object> updatePassword(@RequestParam String id,
                                                 @RequestParam String oldPassword,
                                                 @RequestParam String newPassword) {
        try {
            userService.updatePassword(id, oldPassword, newPassword);
            return ResponseEntity.ok("Password updated successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid old password or user not found.");
        }
    }

    /**
     * Récupérer un utilisateur par email.
     *
     * @param email Email de l'utilisateur.
     * @return Utilisateur trouvé ou message d'erreur.
     */
    @GetMapping("/email")
    public ResponseEntity<Object> getUserByEmail(@RequestParam String email) {
        Optional<User> user = userService.getUserByEmail(email);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("User not found!");
        }
    }


    /**
     * Supprimer un utilisateur par ID.
     *
     * @param id Identifiant de l'utilisateur.
     * @return Message de confirmation.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found!");
        }
    }

    /**
     * Récupérer les utilisateurs par rôle.
     *
     * @param role Rôle des utilisateurs.
     * @return Liste des utilisateurs correspondant au rôle.
     */
    @GetMapping("/role")
    public ResponseEntity<List<User>> getUsersByRole(@RequestParam Role role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    /**
     * Authentifier un utilisateur (login).
     *
     * @param loginRequest Objet contenant l'email et le mot de passe.
     * @return Utilisateur authentifié.
     */
    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        try {
            // Step 1: Authenticate with Keycloak
            Map<String, Object> response = keycloakAdminService.authenticateWithKeycloak(email, password);
            String accessToken = (String) response.get("access_token");

            if (accessToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to retrieve access token from Keycloak.");
            }


            // Step 2: Verify user exists in MongoDB
            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found in MongoDB.");
            }

            // Retrieve user details from MongoDB
            User user = userOptional.get();

            // Prepare response with access token and user details
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("message", "Login successful.");
            responseData.put("accessToken", accessToken);
            responseData.put("user", user);

            return ResponseEntity.ok(responseData);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during login: " + e.getMessage());
        }
    }



    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody SignupRequest request) {
        System.out.println("Signup request received: " + request);
        String email = request.getEmail();
        String name=request.getName();
        String password = request.getPassword();
        String role = request.getRole();

        try {
            userService.createUser(email,name, password, role);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User created successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error during signup: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }



}
