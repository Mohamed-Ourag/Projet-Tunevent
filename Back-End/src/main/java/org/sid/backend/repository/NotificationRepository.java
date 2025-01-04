package org.sid.backend.repository;

import org.sid.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification,String> {
    // Récupérer toutes les notifications pour un utilisateur
    List<Notification> findByUserId(String userId);
}
