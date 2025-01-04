package org.sid.backend.service;


import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.sid.backend.model.Ticket;
import org.sid.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service


public class TicketService {
    @Autowired
    private TicketRepository ticketRepository;

    // Créer un billet
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    // Récupérer les billets par participant
    public List<Ticket> getTicketsByParticipantId(String participantId) {
        return ticketRepository.findByParticipantId(participantId);
    }
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

}
