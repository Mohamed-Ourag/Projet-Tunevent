package org.sid.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;




@Data
@NoArgsConstructor
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;
    private String eventId; // Référence à l'Event
    private String userId; // Référence au User (Participant)
    private int rating; // Note donnée (1 à 5)
    private String comment; // Commentaire
    private Date date; // Date de l'avis


//    @DBRef
//    private User participant; // Relation vers le participant (User)
//
//    @DBRef
//    private Event event; // Relation vers l'événement


}
