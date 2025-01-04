import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AppEvent, Review } from '../models/event';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = '/api/events';

  constructor(private http: HttpClient) {}

  // Retrieve all events
  getAllEvents(): Observable<AppEvent[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data) =>
        data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          date: item.date,
          time: item.time,
          image: item.image,
          rating: item.rating,
          venue: item.venue,
          category: item.category,
          capacity: item.capacity, // Fixed field name
          location: item.location,
          organizerId: item.organizerId,
          organiser: item.organiser
            ? {
              id: item.organiser.id,
              name: item.organiser.name,
              email: item.organiser.email,
              role: item.organiser.role,
              password: item.organiser.password || '', // Optional field
            }
            : undefined,
          reviews: item.reviews || [],
        }))
      ),
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => error);
      })
    );
  }

  // Create a new event
  createEvent(event: AppEvent): Observable<AppEvent> {
    return this.http.post<AppEvent>(this.apiUrl, event).pipe(
      catchError((error) => {
        console.error('Error creating event:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve event by ID
  // getEventById(id: string): Observable<AppEvent> {
  //   return this.http.get<AppEvent>(`${this.apiUrl}/${id}`).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching event by ID:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // Search events by title
  searchEventsByTitle(title: string): Observable<AppEvent[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<AppEvent[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError((error) => {
        console.error('Error searching events by title:', error);
        return throwError(() => error);
      })
    );
  }

  // Delete an event
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting event:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve events by organizer
  getEventsByOrganizer(organizerId: string): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}/organizer/${organizerId}`).pipe(
      catchError((error) => {
        console.error('Error fetching events by organizer:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve events by category
  getEventsByCategory(category: string): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}/category/${category}`).pipe(
      catchError((error) => {
        console.error('Error fetching events by category:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve events by date
  getEventsByDate(date: string): Observable<AppEvent[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<AppEvent[]>(`${this.apiUrl}/date`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events by date:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve upcoming events
  getUpcomingEvents(currentDate: string): Observable<AppEvent[]> {
    const params = new HttpParams().set('currentDate', currentDate);
    return this.http.get<AppEvent[]>(`${this.apiUrl}/upcoming`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching upcoming events:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve past events
  getPastEvents(currentDate: string): Observable<AppEvent[]> {
    const params = new HttpParams().set('currentDate', currentDate);
    return this.http.get<AppEvent[]>(`${this.apiUrl}/past`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching past events:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve events by category and rating
  getEventsByCategoryAndRating(category: string, minRating: number): Observable<AppEvent[]> {
    const params = new HttpParams()
      .set('category', category)
      .set('minRating', minRating.toString());
    return this.http.get<AppEvent[]>(`${this.apiUrl}/category-rating`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events by category and rating:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve events by location
  searchEventsByLocation(location: string): Observable<AppEvent[]> {
    const params = new HttpParams().set('location', location);
    return this.http.get<AppEvent[]>(`${this.apiUrl}/location`, { params }).pipe(
      catchError((error) => {
        console.error('Error searching events by location:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve events by location and organizer
  getEventsByLocationAndOrganizer(location: string, organizerId: string): Observable<AppEvent[]> {
    const params = new HttpParams()
      .set('location', location)
      .set('organizerId', organizerId);
    return this.http.get<AppEvent[]>(`${this.apiUrl}/location-organizer`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events by location and organizer:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve top-rated events
  getTopRatedEvents(rating: number): Observable<AppEvent[]> {
    const params = new HttpParams().set('rating', rating.toString());
    return this.http.get<AppEvent[]>(`${this.apiUrl}/rating`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching top-rated events:', error);
        return throwError(() => error);
      })
    );
  }

  // Update an existing event
  updateEvent(id: string, updatedEvent: AppEvent): Observable<AppEvent> {
    return this.http.put<AppEvent>(`${this.apiUrl}/${id}`, updatedEvent).pipe(
      catchError((error) => {
        console.error('Error updating event:', error);
        return throwError(() => error);
      })
    );
  }

  // Retrieve events by organizer's email
  getEventsByOrganizerEmail(email: string): Observable<AppEvent[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<AppEvent[]>(`${this.apiUrl}/organizer/email`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events by organizer email:', error);
        return throwError(() => error);
      })
    );
  }
  getEventById(id: string): Observable<AppEvent> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((data) => ({
        id: data.id,
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        image: data.image,
        rating: data.rating,
        venue: data.venue,
        category: data.category,
        capacity: data.capacity, // Correct field name
        location: data.location,
        organizerId: data.organizerId,
        organiser: data.organiser
          ? {
            id: data.organiser.id,
            name: data.organiser.name,
            email: data.organiser.email,
            role: data.organiser.role,
            password: data.organiser.password || '', // Optional handling
          }
          : undefined,
        reviews: data.reviews || [],
      })),
      catchError((error) => {
        console.error('Error fetching event by ID:', error);
        return throwError(() => error);
      })
    );
  }

  // Submit rating for an event

  submitEventRating(url: string, data: any): Observable<any> {
    return this.http.post<any>(url, data).pipe(
      catchError((error) => {
        console.error('Error in submitEventRating:', error);
        return throwError(() => error);
      })
    );
  }







}
