import { Component } from '@angular/core';

@Component({
  selector: 'app-rent-venue',
  templateUrl: './rent-venue.component.html',
  styleUrl: './rent-venue.component.css'
})
export class RentVenueComponent {
  activeTab = 'tabs-1'; // Onglet actif par défaut

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
}



















