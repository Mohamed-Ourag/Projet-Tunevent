package org.sid.backend.service;

import lombok.RequiredArgsConstructor;
import org.sid.backend.model.Transaction;
import org.sid.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TransactionService {
    @Autowired
    private  TransactionRepository transactionRepository;
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }


    // Créer une transaction
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Récupérer les transactions par participant
    public List<Transaction> getTransactionsByParticipantId(String participantId) {
        return transactionRepository.findByParticipantId(participantId);
    }

    // Transactions entre deux dates
    public List<Transaction> getTransactionsByDateRange(Date startDate, Date endDate) {
        return transactionRepository.findByDateBetween(startDate, endDate);
    }
}
