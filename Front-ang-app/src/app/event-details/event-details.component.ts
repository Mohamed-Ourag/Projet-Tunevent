import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { AppEvent } from '../models/event'; // Import the AppEvent interface

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css'],
})
export class EventDetailsComponent implements OnInit {
  @Input() selectedTemplate: any; // Template selected by the user

  event: Partial<AppEvent> = {
    title: '',
    description: '',
    date: '',
    time: '',
    image: '',
    rating: 0,
    venue: '',
    category: '',
    capacity: 0,
    location: '',
    organizerId: '', // Organizer ID will be auto-populated
  };

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('EventDetailsComponent initialized.');
    this.setOrganizerId();
  }

  // Set the organizerId based on the authenticated user's data
  setOrganizerId(): void {
    console.log('Fetching authenticated user...');
    const user = this.authService.getUser();
    console.log('Authenticated user:', user);

    if (user && user.id) {
      this.event.organizerId = user.id; // Automatically populate organizer ID
      console.log('Organizer ID set to:', this.event.organizerId);
    } else {
      console.error('User is not authenticated or missing ID.');
      alert(
        'Unable to retrieve user ID. Please log in again to create an event.'
      );
    }
  }

  // Submit the event details form
  submitForm(): void {
    console.log('Preparing to submit Event Details:', this.event);

    const eventData: AppEvent = {
      ...(this.event as AppEvent), // Ensure all required fields are included
      template: this.selectedTemplate,
      image: this.selectedTemplate?.image || '', // Include template image if available
    };

    console.log('Event data being sent to the backend:', eventData);

    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        console.log('Event created successfully:', response);
        alert('Event created successfully!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating event:', err);
        alert('Failed to create the event. Please try again.');
      },
    });
  }

  // Go back to the template selection
  goBackToTemplates(): void {
    console.log('Navigating back to template selection...');
    alert('Going back to select a template.');
  }

  // Reset the event form while keeping the organizer's ID
  resetForm(): void {
    console.log('Resetting event form...');
    const organizerId = this.event.organizerId; // Preserve organizer ID
    this.event = {
      title: '',
      description: '',
      date: '',
      time: '',
      image: '',
      rating: 0,
      venue: '',
      category: '',
      capacity: 0,
      location: '',
      organizerId, // Reassign preserved organizer ID
    };
    console.log('Event form reset. Current event:', this.event);
  }
}
