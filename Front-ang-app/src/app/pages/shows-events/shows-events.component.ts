import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-shows-events',
  templateUrl: './shows-events.component.html',
  styleUrls: ['./shows-events.component.css']
})
export class ShowsEventsComponent implements OnInit {
  activeTab: 'tabs-1' | 'tabs-2' | 'tabs-3' = 'tabs-1';
  event: any; // Event details to display
  upcomingEvents: any[] = [];
  pastEvents: any[] = [];
  allEvents: any[] = [];

  constructor(private router: Router, private eventService: EventService) {}

  ngOnInit(): void {
    this.loadAllEvents();
  }

  // Charger tous les événements depuis le service
  loadAllEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.allEvents = events;

        // Filtrer les événements à venir et passés
        const currentDate = new Date();
        this.upcomingEvents = events.filter((event: any) => new Date(event.date) >= currentDate);
        this.pastEvents = events.filter((event: any) => new Date(event.date) < currentDate);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des événements:', error);
      }
    });
  }

  // Méthode pour changer l'onglet actif
  setActiveTab(tab: 'tabs-1' | 'tabs-2' | 'tabs-3') {
    this.activeTab = tab;
  }

  // Naviguer vers les détails de l'événement
  navigateToDetails(eventId: string): void {
    this.router.navigate(['/event-details', eventId]);
  }

  // Méthode pour gérer le clic sur un bouton d'événement
  onButtonClick(id: string): void {
    console.log('Navigating to event ID:', id);
    this.navigateToDetails(id); // Naviguer vers la page des détails
  }
}
