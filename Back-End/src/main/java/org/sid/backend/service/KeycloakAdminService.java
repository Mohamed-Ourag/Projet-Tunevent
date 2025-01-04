package org.sid.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;



@Service
public class KeycloakAdminService {

    private static final String KEYCLOAK_URL = "http://localhost:8180";
    private static final String REALM = "Tunevent";
    private static final String ADMIN_CLIENT_ID = "admin-cli";
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "20964902";
    private static final Logger logger = LoggerFactory.getLogger(KeycloakAdminService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    // Obtenir un token d'accès administrateur pour interagir avec Keycloak
    public String getAdminAccessToken() {
        String url = KEYCLOAK_URL + "/realms/master/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("username", ADMIN_USERNAME);
        body.add("password", ADMIN_PASSWORD);
        body.add("grant_type", "password");
        body.add("client_id", ADMIN_CLIENT_ID);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody().get("access_token").toString();
        }

        throw new RuntimeException("Failed to fetch admin access token from Keycloak");
    }


    // Créer un utilisateur dans Keycloak
    public void createUserInKeycloak(String email, String username, String password) {
        if (email == null || email.isEmpty() || username == null || username.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Email, username, and password are mandatory.");
        }

        String url = KEYCLOAK_URL + "/admin/realms/" + REALM + "/users";
        String accessToken = getAdminAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build the payload
        Map<String, Object> user = new HashMap<>();
        user.put("username", username); // Assign the correct username
        user.put("email", email);       // Assign the correct email
        user.put("enabled", true);      // Enable the user
        user.put("credentials", List.of(
                Map.of(
                        "type", "password",
                        "value", password, // Correctly assign the password here
                        "temporary", false
                )
        ));

        // Debugging: Print the payload
        System.out.println("Payload sent to Keycloak: " + user);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(user, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("Keycloak error: " + response.getBody());
            }
            System.out.println("User successfully created in Keycloak: " + response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Error creating user in Keycloak: " + e.getMessage(), e);
        }
    }
    public Map<String, Object> authenticateWithKeycloak(String username, String password) {
        String url = KEYCLOAK_URL + "/realms/" + REALM + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.set("client_id", "frontend-client");
        body.set("client_secret", "RC9wWBfNUlDKXMgNQxP9ZVkRKrzdoIj4");
        body.set("grant_type", "password");
        body.set("username", username);
        body.set("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            System.out.println("Debug: Sending POST request to Keycloak");
            System.out.println("URL: " + url);
            System.out.println("Headers: " + headers);
            System.out.println("Body: " + body);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Debug: Successful response from Keycloak");
                return response.getBody();
            } else {
                System.out.println("Debug: Error response from Keycloak - Status: " + response.getStatusCode());
                System.out.println("Debug: Response Body - " + response.getBody());
                throw new RuntimeException("Authentication failed with Keycloak");
            }
        } catch (HttpClientErrorException e) {
            System.out.println("Debug: HTTP Client Error - " + e.getStatusCode());
            System.out.println("Debug: Response Body - " + e.getResponseBodyAsString());
            throw new RuntimeException("Error during Keycloak authentication: " + e.getMessage(), e);
        } catch (Exception e) {
            System.out.println("Debug: General Error - " + e.getMessage());
            throw new RuntimeException("Error during Keycloak authentication: " + e.getMessage(), e);
        }
    }
    public void updateUserInKeycloak(String keycloakId, String email, String name, String password) {
        String url = KEYCLOAK_URL + "/admin/realms/" + REALM + "/users/" + keycloakId;
        String accessToken = getAdminAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Construire le payload pour Keycloak
        Map<String, Object> payload = new HashMap<>();
        if (name != null) payload.put("firstName", name);
        if (email != null) payload.put("email", email);
        if (password != null) {
            payload.put("credentials", List.of(
                    Map.of(
                            "type", "password",
                            "value", password,
                            "temporary", false
                    )
            ));
        }

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            restTemplate.exchange(url, HttpMethod.PUT, request, String.class);
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Error updating user in Keycloak: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new RuntimeException("General error updating user in Keycloak: " + e.getMessage(), e);
        }
    }
    public String getKeycloakIdByEmail(String email) {
        String url = KEYCLOAK_URL + "/admin/realms/" + REALM + "/users?email=" + email;
        String accessToken = getAdminAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, request, List.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> users = response.getBody();

                if (users != null && !users.isEmpty()) {
                    return users.get(0).get("id").toString(); // Récupérer le premier ID
                } else {
                    throw new RuntimeException("No user found with email: " + email);
                }
            } else {
                throw new RuntimeException("Failed to fetch user from Keycloak: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Keycloak ID by email: " + e.getMessage(), e);
        }
    }
    public void updatePasswordInKeycloak(String keycloakId, String newPassword) {
        String url = String.format("%s/admin/realms/%s/users/%s/reset-password", KEYCLOAK_URL, REALM, keycloakId);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("type", "password");
        requestBody.put("value", newPassword);
        requestBody.put("temporary", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getAdminAccessToken()); // Utilisation du token dynamique

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                logger.error("Failed to update password in Keycloak: {}", response.getBody());
                throw new RuntimeException("Failed to update password in Keycloak: " + response.getBody());
            }
            logger.info("Password updated successfully for Keycloak ID: {}", keycloakId);
        } catch (HttpClientErrorException e) {
            logger.error("HTTP Error while updating password in Keycloak: {}", e.getResponseBodyAsString());
            throw new RuntimeException("Error updating password in Keycloak: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            logger.error("General error while updating password in Keycloak: {}", e.getMessage());
            throw new RuntimeException("Error updating password in Keycloak: " + e.getMessage(), e);
        }
    }








}
