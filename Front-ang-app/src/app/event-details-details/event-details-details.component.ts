import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../services/event.service';
import { AppEvent } from '../models/event';

@Component({
  selector: 'app-event-details-details',
  templateUrl: './event-details-details.component.html',
  styleUrls: ['./event-details-details.component.css'],
})
export class EventDetailsDetailsComponent implements OnInit {
  event: AppEvent | undefined; // Holds the event details
  userRating: number = 0; // Holds the user's rating input

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(eventId).subscribe({
        next: (data: any) => {
          this.event = this.mapToAppEvent(data); // Maps backend data to AppEvent
        },
        error: (error: any) => {
          console.error('Error fetching event:', error);
        },
      });
    }
  }

  goBack(): void {
    window.history.back(); // Navigates back to the previous page
  }

  // Map backend response data to the AppEvent interface
  private mapToAppEvent(data: any): AppEvent {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      image: data.image,
      rating: data.rating,
      venue: data.venue,
      category: data.category,
      capacity: data.capacity,
      location: data.location,
      organizerId: data.organizerId,
      organiser: data.organiser
        ? {
          id: data.organiser.id,
          name: data.organiser.name,
          email: data.organiser.email,
          role: data.organiser.role,
          password: data.organiser.password || '',
        }
        : undefined,
      reviews: data.reviews || [],
    };
  }

  // Submit the user's rating for the event
  submitRating(): void {
    if (!this.event) {
      console.error('Event not found. Cannot submit rating.');
      return;
    }

    const ratingData = {
      rating: this.userRating, // Only send the rating
    };

    console.log('Submitting rating to correct URL:', ratingData);

    // Ensure the API endpoint is updated correctly
    this.eventService.submitEventRating(`/api/reviews/${this.event.id}/rate`, ratingData).subscribe({
      next: (response: any) => {
        console.log('Rating submitted successfully:', response);
        alert('Thank you for your rating!');
        if (this.event) {
          this.event.rating = response.newAverageRating || this.event.rating;
        }
      },
      error: (error: any) => {
        console.error('Error submitting rating:', error);
        alert('Failed to submit the rating. Please try again.');
      },
    });
  }



}
