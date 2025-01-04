import { Component } from '@angular/core';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  tickets = [
    {
      image: 'images/ticket-01.jpg',
      price: '$25',
      availability: 'There Are 150 Tickets Left For This Show',
      title: 'Wonderful Festival',
      time: 'Thursday: 05:00 PM to 10:00 PM',
      location: '908 Copacabana Beach, Rio de Janeiro'
    },
    {
      image: 'images/ticket-02.jpg',
      price: '$45',
      availability: 'There Are 200 Tickets Left For This Show',
      title: 'Golden Festival',
      time: 'Sunday: 06:00 PM to 09:00 PM',
      location: '789 Copacabana Beach, Rio de Janeiro'
    },
    {
      image: 'images/ticket-03.jpg',
      price: '$25',
      availability: 'There Are 150 Tickets Left For This Show',
      title: 'Wonderful Festival',
      time: 'Thursday: 05:00 PM to 10:00 PM',
      location: '908 Copacabana Beach, Rio de Janeiro'
    },
    {
      image: 'images/ticket-04.jpg',
      price: '$25',
      availability: 'There Are 150 Tickets Left For This Show',
      title: 'Wonderful Festival',
      time: 'Thursday: 05:00 PM to 10:00 PM',
      location: '908 Copacabana Beach, Rio de Janeiro'
    },
    {
      image: 'images/ticket-05.jpg',
      price: '$25',
      availability: 'There Are 150 Tickets Left For This Show',
      title: 'Wonderful Festival',
      time: 'Thursday: 05:00 PM to 10:00 PM',
      location: '908 Copacabana Beach, Rio de Janeiro'
    },
    {
      image: 'images/ticket-06.jpg',
      price: '$25',
      availability: 'There Are 150 Tickets Left For This Show',
      title: 'Wonderful Festival',
      time: 'Thursday: 05:00 PM to 10:00 PM',
      location: '908 Copacabana Beach, Rio de Janeiro'
    },
    // Ajoutez d'autres tickets ici
  ];
}
