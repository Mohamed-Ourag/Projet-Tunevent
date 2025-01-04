import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.css']
})
export class EventTableComponent {
  @Input() events: any[] = []; // Propriété pour recevoir les données
}

