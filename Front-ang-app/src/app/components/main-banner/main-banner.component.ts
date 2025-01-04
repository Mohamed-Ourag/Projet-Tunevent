import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';


@Component({
  selector: 'app-main-banner',
  templateUrl: './main-banner.component.html',
  styleUrls: ['./main-banner.component.css']
})
export class MainBannerComponent implements OnInit {
  constructor(private eventService: EventService) {}
  events: any[] = [];
  filteredEvents: any[] = [];
  ngOnInit() {
    this.startCountdown();
    this.loadEvents(); // Charger les événements depuis EventService
  }



  updateRating(venueIndex: number, newRating: number): void {
    this.events[venueIndex].rating = newRating;
  }

  // Configuration du carrousel
  carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    navText: ['', ''],
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };

  // Variables pour le compteur
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  targetDate: Date = new Date('2025-03-31T00:00:00'); // Exemple de date cible


    venues = [
    {
      title: 'Radio City Musical Hall',
      time: 'Tuesday: 15:30-19:3000',
      location: 'Copacabana Beach, Rio de Janeiro',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/event-01.png',
      detailsUrl: '/ticketdetails',
      sitemap: 250,
      userCapacity: 500,
      price: '$4588',
    },
    {
      title: 'Madison Square Garden',
      time: 'Tuesday: 15:30-19:30',
      location: 'Copacabana Beach, Rio de Janeiro',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/event-02.jpg',
      detailsUrl: '/ticketdetails',
      sitemap: 450,
      userCapacity: 650,
      price: '$55',

    },
    {
      title: 'Madison Square Garden',
      time: 'Tuesday: 15:30-19:30',
      location: 'Copacabana Beach, Rio de Janeiro',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      image: 'images/event-03.jpg',
      detailsUrl: '/ticketdetails',
      sitemap: 450,
      userCapacity: 650,
      price: '$55',
    },


  ];

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events; // Assign fetched events to `this.events`
        this.filteredEvents = this.events.filter(event => event.rating >= 4); // Apply filter
        console.log('Filtered events:', this.filteredEvents); // Debug to verify data
      },
      error: (err) => {
        console.error('Error fetching events:', err); // Handle errors
      }
    });
  }









  // Fonction pour démarrer le compteur
  startCountdown() {
    setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate.getTime() - now;

      if (distance > 0) {
        this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      } else {
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
      }
    }, 1000); // Mise à jour toutes les secondes
  }
  purchaseTicket(index: number): void {
    const selectedVenue = this.venues[index];
    alert(`You selected: ${selectedVenue.title}. Tickets start at ${selectedVenue.price}.`);
  }
  generateStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'fa-star' : 'fa-star-o');
    }
    return stars;
  }



}
