package org.sid.backend.service;

import org.sid.backend.model.Event;
import org.sid.backend.model.Review;
import org.sid.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private EventService    eventRepository;


    // Ajouter un avis
    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    // Récupérer les avis par événement
    public List<Review> getReviewsByEventId(String eventId) {
        return reviewRepository.findByEventId(eventId);
    }

    // Supprimer un avis
    public void deleteReview(String id) {
        reviewRepository.deleteById(id);
    }
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    public void createReview(Review review) {
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
        review.setDate(new Date()); // Ajoute la date actuelle
        reviewRepository.save(review); // Sauvegarde l'évaluation
    }
    public Optional<Review> getReviewByEventAndUser(String eventId, String userId) {
        return reviewRepository.findByEventIdAndUserId(eventId, userId);
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }




}
