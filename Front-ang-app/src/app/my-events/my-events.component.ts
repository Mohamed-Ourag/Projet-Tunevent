import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent implements OnInit {
  events: any[] = []; // Déclaration de la propriété events comme un tableau
  userEvents: any[] = []; // Store user's events
  userName: string = ''; // Store the user's name
  isLoading: boolean = true; // Track loading state

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name; // Set the user's name
      this.fetchUserEvents(user.email); // Fetch events created by the user
    } else {
      console.error('User not logged in');
    }
  }

  fetchUserEvents(email: string): void {
    this.eventService.getEventsByOrganizerEmail(email).subscribe({
      next: (events) => {
        this.userEvents = events;
        this.isLoading = false; // Stop loading spinner
      },
      error: (err) => {
        console.error('Failed to fetch user events:', err);
        this.isLoading = false;
      },
    });
  }
  loadUserEvents(email: string): void {
    this.eventService.getEventsByOrganizerEmail(email).subscribe({
      next: (events) => {
        this.events = events; // Stockez les événements récupérés
        console.log('User events loaded successfully:', events);
      },
      error: (error) => {
        console.error('Error fetching user events:', error);
      },
    });
  }

}

