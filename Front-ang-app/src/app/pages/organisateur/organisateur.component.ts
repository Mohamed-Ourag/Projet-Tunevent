import { Component } from '@angular/core';

@Component({
  selector: 'app-organisateur',
  templateUrl: './organisateur.component.html',
  styleUrls: ['./organisateur.component.css'],
})
export class OrganisateurComponent {
  events = [];
  activeTab = 'tabs-1';// Event list

  onCreateNewEvent() {
    console.log('Create New Event button clicked');
    // Logic for event creation
  }
  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }
}
