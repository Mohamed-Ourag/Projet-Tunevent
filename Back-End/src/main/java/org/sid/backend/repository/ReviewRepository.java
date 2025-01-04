package org.sid.backend.repository;

import org.sid.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ReviewRepository extends MongoRepository<Review,String> {
    // Trouver les avis par événement
    List<Review> findByEventId(String eventId);

    // Trouver les avis par participant
    List<Review> findByUserId(String participantId);

    Optional<Review> findByEventIdAndUserId(String eventId, String userId);

}
