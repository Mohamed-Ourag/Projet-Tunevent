import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, BehaviorSubject, throwError, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/api/users'; // Base URL for API
  private userSubject = new BehaviorSubject<any | null>(null); // Subject to hold the current user information
  user$ = this.userSubject.asObservable(); // Observable for user data changes

  constructor(private http: HttpClient ,private authService: AuthService) {}

  /**
   * Fetch user information by email and update the subject
   * @returns Observable containing user data or null if no email is found
   */
  fetchUserInfo(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap((user) => {
        this.userSubject.next(user); // Met à jour l'état de l'utilisateur
        localStorage.setItem('user', JSON.stringify(user)); // Sauvegarde dans localStorage
      }),
      catchError((error) => {
        console.error('Error fetching user info:', error);
        return of(null);
      })
    );
  }


  /**
   * Fetch user information directly by email
   * @param email User email
   * @returns Observable containing user data
   */
  fetchUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }

  /**
   * Get the current user's role
   * @returns The role of the currently logged-in user or null
   */
  getUserRole(): string | null {
    const currentUser = this.userSubject.value;
    return currentUser?.role || null;
  }

  /**
   * Logout the user and reset their data
   */
  logout(): void {
    localStorage.removeItem('userEmail'); // Remove stored email
    this.userSubject.next(null); // Reset user data
  }

  /**
   * Get the current user data from the BehaviorSubject
   * @returns The current user data or null if not set
   */
  getUser(): any {
    return this.userSubject.value;
  }
}
