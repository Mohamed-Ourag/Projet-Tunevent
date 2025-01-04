package org.sid.backend.repository;

import org.sid.backend.model.Event;
import org.sid.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    // Requête personnalisée pour rechercher des événements par titre
    List<Event> findByTitleContaining(String title);

    // Requête pour rechercher des événements par organisateur
    List<Event> findByOrganizerId(String organizerId);

    // Requête pour rechercher des événements par catégorie
    List<Event> findByCategory(String category);

    // Requête pour rechercher des événements par lieu
    List<Event> findByLocationContaining(String location);

    // Requête pour rechercher des événements par note supérieure ou égale à une certaine valeur
    List<Event> findByRatingGreaterThanEqual(double rating);

    // Requête pour rechercher des événements par date
    List<Event> findByDate(Date date);

    // Requête pour rechercher des événements dont la date est supérieure ou égale à une certaine date (événements à venir)
    List<Event> findByDateAfter(Date date);

    // Requête pour rechercher des événements dont la date est inférieure ou égale à une certaine date (événements passés)
    List<Event> findByDateBefore(Date date);

    // Requête pour rechercher des événements par catégorie et note supérieure à une certaine valeur
    List<Event> findByCategoryAndRatingGreaterThanEqual(String category, double rating);

    // Requête pour rechercher des événements dans un lieu spécifique et un organisateur spécifique
    List<Event> findByLocationAndOrganizerId(String location, String organizerId);
    List<Event> findByOrganizer(User organizer); // Query by organizer (User entity)
    List<Event> findByLocationAndOrganizer(String location, User organizer);

    List<Event> findByTitleContainingIgnoreCase(String title);

    List<Event> findByCategoryIgnoreCase(String category);

    List<Event> findByLocationContainingIgnoreCase(String location);
    Optional<Event> findById(String id);

}
