package org.sid.backend.controller;

import io.jsonwebtoken.Claims;
import org.sid.backend.model.Review;
import org.sid.backend.service.EventService;
import org.sid.backend.service.JwtUtil;
import org.sid.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/reviews")
public class ReviewController {
    private static final String PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAo6/LWTStb7IZvL6C7JkTM5DUAOcroLYoUkcIv127La5nUpD4qGjt11l/TPc6HleJ/zx1E98t51q6bWgzyxJh/foUoZ4Lw+QpwSUwomNCRAZzjmoQx3EEY5RkVZunHQcIDjbu+7dkiJo4NIG1G7rG7JSrkqf5KVqcU+icdkSkXlwlxg/UVYoL3mu9NRfxag6HQD9NMWCJ51ApP8ox9KZ5HoOSX9dzIgfedwb06z9AacgbI9qR+0H3Vmim6JPTMFCVU+OGjd4n73x/JdgPJfEGl69D3OGp+6x2oGqQSTdzn7cOzdThpxSKmlQW5jWHOvG25HD58Uin8lU4FrkWMzdhrwIDAQAB";
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Review>> getReviewsByEventId(@PathVariable String eventId) {
        return ResponseEntity.ok(reviewService.getReviewsByEventId(eventId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventId}/rate")
    public ResponseEntity<?> rateEvent(@PathVariable String eventId,
                                       @RequestHeader("Authorization") String authorizationHeader,
                                       @RequestBody Map<String, Integer> body) {
        try {
            // Extract the token from the header
            String token = authorizationHeader.replace("Bearer ", "");

            // Extract the user ID using JwtUtil
            String userId = jwtUtil.extractUserId(token,PUBLIC_KEY);


            // Extract the rating from the request body
            int rating = body.get("rating");

            // Submit the rating for the event
            double newAverageRating = eventService.submitRating(eventId, userId, rating);

            // Return the updated average rating
            return ResponseEntity.ok(Map.of("newAverageRating", newAverageRating));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token: " + e.getMessage());
        }
    }
    private String preprocessJwt(String token) {
        String base64UrlEncodedToken = token.replace('-', '+').replace('_', '/');
        int paddingLength = (4 - base64UrlEncodedToken.length() % 4) % 4;
        base64UrlEncodedToken += "=".repeat(paddingLength);
        return base64UrlEncodedToken;
    }



}
