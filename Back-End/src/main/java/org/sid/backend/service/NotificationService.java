package org.sid.backend.service;

import lombok.RequiredArgsConstructor;
import org.sid.backend.model.Notification;
import org.sid.backend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class NotificationService {
    @Autowired
    private  NotificationRepository notificationRepository;

    // Créer une nouvelle notification
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // Récupérer les notifications par utilisateur
    public List<Notification> getNotificationsByUserId(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    // Supprimer une notification
    public void deleteNotification(String id) {
        notificationRepository.deleteById(id);
    }
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }


}
