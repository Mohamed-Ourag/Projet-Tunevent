package org.sid.backend.repository;

import org.sid.backend.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TicketRepository extends MongoRepository<Ticket,String> {
    // Trouver les billets par participant
    List<Ticket> findByParticipantId(String participantId);

    // Trouver les billets par événement
    List<Ticket> findByEventId(String eventId);
}
