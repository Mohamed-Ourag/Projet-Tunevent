package org.sid.backend.model;

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
@Document(collection = "transactions")

public class Transaction {

    @Id
    private String id;
    private String participantId; // Référence au User (Participant)
    private String ticketId; // Référence au Ticket
    private double amount; // Montant de la transaction
    private Date date; // Date de la transaction
    private String status; // Status de la transaction (Success, Failed, Pending)

//    @DBRef
//    private User participant; // Relation vers le participant (User)
//
//    @DBRef
//    private Ticket ticket; // Relation vers le billet acheté


}
