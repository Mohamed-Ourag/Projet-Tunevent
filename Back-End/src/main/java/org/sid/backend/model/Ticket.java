package org.sid.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


@Builder


@Data
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;
    private String eventId; // Référence à l'Event
    private String participantId; // Référence au User (Participant)
    private String type; // Type de billet (Standard, VIP)
    private double price;
    private String qrCode; // QR Code pour le billet

//    @DBRef
//    private User participant; // Relation vers le participant (User)
//
//    @DBRef
//    private Event event; // Relation vers l'événement


}
