package org.sid.backend.repository;

import org.sid.backend.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface TransactionRepository extends MongoRepository<Transaction,String> {
    // Trouver les transactions par participant
    List<Transaction> findByParticipantId(String participantId);

    // Transactions entre deux dates
    List<Transaction> findByDateBetween(Date startDate, Date endDate);
}
