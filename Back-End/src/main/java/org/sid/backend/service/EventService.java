package org.sid.backend.service;

import lombok.RequiredArgsConstructor;
import org.sid.backend.model.Event;
import org.sid.backend.model.Review;
import org.sid.backend.model.User;
import org.sid.backend.repository.EventRepository;
import org.sid.backend.repository.ReviewRepository;
import org.sid.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final ReviewRepository reviewRepository;

    // Retrieve all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Create an event with an organizer
    @Transactional
    public Event createEvent(Event event) {
        String organizerId = event.getOrganizerId(); // Assume organizerId is passed in the event object.

        if (organizerId == null || organizerId.isEmpty()) {
            throw new IllegalArgumentException("Organizer ID cannot be null or empty.");
        }

        // Fetch the organizer from the database
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + organizerId));

        // Associate the organizer with the event
        event.setOrganizer(organizer);

        return eventRepository.save(event);
    }

    // Search events by title
    public List<Event> searchEventsByTitle(String title) {
        return eventRepository.findByTitleContainingIgnoreCase(title);
    }

    // Delete an event by ID
    @Transactional
    public void deleteEvent(String eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Event not found with ID: " + eventId);
        }
        eventRepository.deleteById(eventId);
    }

    // Retrieve events by organizer ID
    public List<Event> getEventsByOrganizer(String organizerId) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + organizerId));
        return eventRepository.findByOrganizer(organizer);
    }

    // Retrieve events by organizer email
    public List<Event> getEventsByOrganizerEmail(String email) {
        User organizer = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with email: " + email));
        return eventRepository.findByOrganizer(organizer);
    }

    // Retrieve events by category
    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategoryIgnoreCase(category);
    }

    // Retrieve events by location
    public List<Event> searchEventsByLocation(String location) {
        return eventRepository.findByLocationContainingIgnoreCase(location);
    }

    // Retrieve top-rated events
    public List<Event> getTopRatedEvents(double rating) {
        return eventRepository.findByRatingGreaterThanEqual(rating);
    }

    // Retrieve events by exact date
    public List<Event> getEventsByDate(Date date) {
        return eventRepository.findByDate(date);
    }

    // Retrieve upcoming events
    public List<Event> getUpcomingEvents(Date currentDate) {
        return eventRepository.findByDateAfter(currentDate);
    }

    // Retrieve past events
    public List<Event> getPastEvents(Date currentDate) {
        return eventRepository.findByDateBefore(currentDate);
    }

    // Retrieve events by category and rating
    public List<Event> getEventsByCategoryAndRating(String category, double minRating) {
        return eventRepository.findByCategoryAndRatingGreaterThanEqual(category, minRating);
    }

    // Retrieve an event by ID
    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + id));
    }

    // Retrieve events by location and organizer
    public List<Event> getEventsByLocationAndOrganizer(String location, String organizerId) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with ID: " + organizerId));
        return eventRepository.findByLocationAndOrganizer(location, organizer);
    }

    // Update an existing event
    @Transactional
    public Event updateEvent(String eventId, Event updatedEvent) {
        Event existingEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        // Update fields if they are not null or zero
        if (updatedEvent.getTitle() != null) existingEvent.setTitle(updatedEvent.getTitle());
        if (updatedEvent.getDescription() != null) existingEvent.setDescription(updatedEvent.getDescription());
        if (updatedEvent.getDate() != null) existingEvent.setDate(updatedEvent.getDate());
        if (updatedEvent.getTime() != null) existingEvent.setTime(updatedEvent.getTime());
        if (updatedEvent.getLocation() != null) existingEvent.setLocation(updatedEvent.getLocation());
        if (updatedEvent.getCategory() != null) existingEvent.setCategory(updatedEvent.getCategory());
        if (updatedEvent.getRating() > 0) existingEvent.setRating(updatedEvent.getRating());
        if (updatedEvent.getVenue() != null) existingEvent.setVenue(updatedEvent.getVenue());
        if (updatedEvent.getCapacity() > 0) existingEvent.setCapacity(updatedEvent.getCapacity());

        return eventRepository.save(existingEvent);
    }

    public void updateEventRating(String eventId) {
        List<Review> reviews = reviewRepository.findByEventId(eventId);
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));
        event.setRating(averageRating);
        eventRepository.save(event);
    }






    public double submitRating(String eventId, String userId, int rating) {
        // Validate rating range
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        // Retrieve the event
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        // Check if the user has already rated
        Optional<Review> optionalReview = reviewRepository.findByEventIdAndUserId(eventId, userId);
        if (optionalReview.isPresent()) {
            // User has already rated, update the existing review
            Review existingReview = optionalReview.get();
            System.out.println("User has already rated. Updating their rating...");
            int previousRating = existingReview.getRating();
            existingReview.setRating(rating);
            reviewRepository.save(existingReview);

            // Calculate the new average rating
            double totalRating = (event.getRating() * event.getNumberOfRatings()) - previousRating + rating;
            double newAverageRating = totalRating / event.getNumberOfRatings();
            event.setRating(newAverageRating);
            eventRepository.save(event);

            return newAverageRating;
        } else {
            // User has not rated yet, create a new review
            System.out.println("New rating from user.");
            Review newReview = new Review();
            newReview.setEventId(eventId);
            newReview.setUserId(userId);
            newReview.setRating(rating);
            reviewRepository.save(newReview);

            // Calculate the new average rating
            double totalRating = (event.getRating() * event.getNumberOfRatings()) + rating;
            int newNumberOfRatings = event.getNumberOfRatings() + 1;
            double newAverageRating = totalRating / newNumberOfRatings;
            event.setRating(newAverageRating);
            event.setNumberOfRatings(newNumberOfRatings);
            eventRepository.save(event);

            return newAverageRating;
        }
    }

}
