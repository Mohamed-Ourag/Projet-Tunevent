package org.sid.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.sid.backend.model.Event;
import org.sid.backend.model.User;
import org.sid.backend.service.EventService;
import org.sid.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/events")
public class EventController {
    private final UserService userService ;

    private final EventService eventService;



    // Retrieve all events
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // Create a new event
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(event));
    }
    // Retrieve an event by ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        Event event = eventService.getEventById(id);
        if (event != null) {
            return ResponseEntity.ok(event);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



    private String getLoggedInUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername(); // This is usually the email or username
        } else {
            return principal.toString();
        }
    }

    // Search events by title
    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String title) {
        return ResponseEntity.ok(eventService.searchEventsByTitle(title));
    }

    // Delete an event by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // Retrieve events by organizer ID
    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable String organizerId) {
        return ResponseEntity.ok(eventService.getEventsByOrganizer(organizerId));
    }

    // Retrieve events by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Event>> getEventsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(eventService.getEventsByCategory(category));
    }

    // Retrieve events by a specific date
    @GetMapping("/date")
    public ResponseEntity<List<Event>> getEventsByDate(@RequestParam Date date) {
        return ResponseEntity.ok(eventService.getEventsByDate(date));
    }

    // Retrieve upcoming events
    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents(@RequestParam Date currentDate) {
        return ResponseEntity.ok(eventService.getUpcomingEvents(currentDate));
    }

    // Retrieve past events
    @GetMapping("/past")
    public ResponseEntity<List<Event>> getPastEvents(@RequestParam Date currentDate) {
        return ResponseEntity.ok(eventService.getPastEvents(currentDate));
    }

    // Retrieve events by category and minimum rating
    @GetMapping("/category-rating")
    public ResponseEntity<List<Event>> getEventsByCategoryAndRating(
            @RequestParam String category,
            @RequestParam double minRating
    ) {
        return ResponseEntity.ok(eventService.getEventsByCategoryAndRating(category, minRating));
    }

    // Retrieve events by location
    @GetMapping("/location")
    public ResponseEntity<List<Event>> searchEventsByLocation(@RequestParam String location) {
        return ResponseEntity.ok(eventService.searchEventsByLocation(location));
    }

    // Retrieve events by location and organizer
    @GetMapping("/location-organizer")
    public ResponseEntity<List<Event>> getEventsByLocationAndOrganizer(
            @RequestParam String location,
            @RequestParam String organizerId
    ) {
        return ResponseEntity.ok(eventService.getEventsByLocationAndOrganizer(location, organizerId));
    }

    // Retrieve top-rated events
    @GetMapping("/rating")
    public ResponseEntity<List<Event>> getTopRatedEvents(@RequestParam double rating) {
        return ResponseEntity.ok(eventService.getTopRatedEvents(rating));
    }

    // Update an existing event
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable String id,
            @RequestBody @Valid Event updatedEvent
    ) {
        return ResponseEntity.ok(eventService.updateEvent(id, updatedEvent));
    }

    // Retrieve events by organizer's email
    @GetMapping("/organizer/email")
    public ResponseEntity<List<Event>> getEventsByOrganizerEmail(@RequestParam String email) {
        try {
            List<Event> events = eventService.getEventsByOrganizerEmail(email);
            return ResponseEntity.ok(events);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
