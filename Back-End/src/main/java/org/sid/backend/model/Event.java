    package org.sid.backend.model;

    import com.fasterxml.jackson.annotation.JsonFormat;
    import jakarta.validation.constraints.NotEmpty;
    import jakarta.validation.constraints.NotNull;
    import jakarta.validation.constraints.PositiveOrZero;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.mapping.DBRef;
    import org.springframework.data.mongodb.core.mapping.Document;

    import java.util.Date;
    import java.util.List;

    @Data
    @NoArgsConstructor
    @Document(collection = "events") // Spécifie que cette classe est liée à la collection "events"
    public class Event {
        @Id // Indique que cet attribut correspond à l'identifiant unique du document
        private String id;
        @NotNull
        @NotEmpty
        private String title;
        private String description;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
        private Date date;
        private String time;
        private String image;
        @PositiveOrZero(message = "Rating must be a positive number")
        private double rating;
        private String venue;
        private String category;
        private int capacity = 1;
        private String location;
        private String organizerId;
        private int numberOfRatings;



        @DBRef
        private User organizer;
        @DBRef
        private List<Review> reviews;



        //    @DBRef
    //    private User organiser; // Relation vers l'organisateur (User)
    //
    //    @DBRef
    //    private List<Review> reviews; // Plusieurs avis pour un événement


        // Getters et Setters
    }
