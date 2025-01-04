package org.sid.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.validation.constraints.Email;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String keycloakId;
    private String name;
    @Email(message = "Invalid email format")
    private String email;
    private String password;
    private Role role; // ORGANIZER, PARTICIPANT, ADMIN




    @DBRef
    private List<Event> eventsOrganized;




//    @DBRef
//    private List<Notification> notifications; // Un utilisateur peut recevoir plusieurs notifications
//
//    @DBRef
//    private List<Review> reviews; // Un utilisateur peut donner plusieurs avis
//    @JsonManagedReference
//    private List<Notification> notificationss;



}

