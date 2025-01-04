import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppEvent } from '../models/event';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css'],
})
export class EventManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'date',
    'time',
    'location',
    'category',
    'rating',
    'guests',
    'venue',
  ];
  dataSource = new MatTableDataSource<AppEvent>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchTerm: string = '';
  allEvents: AppEvent[] = [];
  filteredEvents: AppEvent[] = [];
  selectedTab: string = 'All';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents(); // Load events from the backend
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events: AppEvent[]) => {
        console.log('Processed events:', events);
        this.allEvents = events;
        this.filteredEvents = this.allEvents;
        this.dataSource.data = this.filteredEvents;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }




  onTabChange(tab: string): void {
    this.selectedTab = tab;
    this.filterEvents();
  }

  filterEvents(): void {
    const today = new Date();

    if (this.selectedTab === 'All') {
      this.filteredEvents = this.allEvents;
    } else if (this.selectedTab === 'Upcoming') {
      this.filteredEvents = this.allEvents.filter(
        (event) => new Date(event.date) > today
      );
    } else if (this.selectedTab === 'Past') {
      this.filteredEvents = this.allEvents.filter(
        (event) => new Date(event.date) < today
      );
    }
    this.dataSource.data = this.filteredEvents;
  }

  applyFilter(): void {
    const filterValue = this.searchTerm.toLowerCase();
    this.filteredEvents = this.allEvents.filter((event) =>
      event.title.toLowerCase().includes(filterValue)
    );
    this.dataSource.data = this.filteredEvents;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredEvents = this.allEvents;
    this.dataSource.data = this.filteredEvents;
  }
}
