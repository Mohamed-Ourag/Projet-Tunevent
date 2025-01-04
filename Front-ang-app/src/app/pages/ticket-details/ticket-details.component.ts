import { Component } from '@angular/core';
import {QuantityService} from '../../quantity';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent {

  constructor(private quantityService: QuantityService) { }

  ngOnInit(): void {
    this.quantityService.initialize();
  }
}
