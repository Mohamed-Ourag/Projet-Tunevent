package org.sid.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;


@Builder

@Data
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    private String userId; // Référence au User
    private String message; // Contenu de la notification
    private String type; // Type de notification (Rappel, Confirmation, etc.)
    private Date date; // Date de création
//    @JsonBackReference
//    @DBRef
//    private User user; // Relation vers l'utilisateur qui reçoit la notification





}
